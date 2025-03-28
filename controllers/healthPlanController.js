const HealthPlan = require('../models/healthPlanModel');
const User = require('../models/userModel');
const axios = require('axios');
require('dotenv').config();

// Helper function to calculate pregnancy stage
const calculatePregnancyStage = (pregnancyDate) => {
    if (!pregnancyDate) return 'Not pregnant';
    const today = new Date();
    const pregDate = new Date(pregnancyDate);
    const diffTime = Math.abs(today - pregDate);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    if (diffWeeks < 13) return 'First Trimester';
    if (diffWeeks < 27) return 'Second Trimester';
    if (diffWeeks < 40) return 'Third Trimester';
    return 'Postpartum';
};

exports.generateHealthPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('User ID from token:', userId);

        const user = await User.findById(userId);
        console.log('Fetched user:', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const age = user.age;
        const medicalHistory = user.healthHistory ? [user.healthHistory] : ['No medical history provided'];
        const pregnancyStage = calculatePregnancyStage(user.pregnancyDate);

        console.log('Extracted data:', { age, medicalHistory, pregnancyStage });

        if (age === null || age === undefined ) {
            return res.status(400).json({
                message: 'Missing required health data. Please ensure age and weight are set in your profile.'
            });
        }

        const apiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Generate a structured pregnancy health plan for a ${age}, with medical history: "${medicalHistory.join(', ')}", currently in the ${pregnancyStage} stage. Return the response as a clean JSON object (no markdown or extra formatting) with sections for "diet", "exercise", and "medical_recommendations". Do not inlcude lists or bullet points.`
                    }
                ],
                max_tokens: 1024
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.openAiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiGeneratedPlan = apiResponse.data.choices[0].message.content;

        let parsedPlan;
        try {
            parsedPlan = JSON.parse(aiGeneratedPlan);
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            return res.status(500).json({ message: 'Invalid health plan format from AI' });
        }

        const newHealthPlan = new HealthPlan({
            userId,
            age,
            medicalHistory,
            pregnancyStage,
            planDetails: aiGeneratedPlan
        });

        await newHealthPlan.save();

        res.status(201).json({
            message: 'Custom health plan generated successfully',
            healthPlan: newHealthPlan
        });
    } catch (error) {
        console.error('Error generating health plan:', error.response ? error.response.data : error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getHealthPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const healthPlan = await HealthPlan.findOne({ userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'fullName email');

        if (!healthPlan) {
            return res.status(404).json({ message: 'No health plan found' });
        }

        res.status(200).json(healthPlan);
    } catch (error) {
        console.error('Error fetching health plan:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};