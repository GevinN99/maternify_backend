const Exercise = require('../models/epdsTest/exercise');

exports.addExercise = async (req, res) => {
    try {
        const { title, description, instructions, minScore, maxScore } = req.body;
        const exercise = new Exercise({ title, description, instructions, minScore, maxScore });
        await exercise.save();
        res.status(201).json({ message: "Exercise added successfully!" });
      } catch (error) {
        res.status(500).json({ error: "Failed to add exercise" });
      }
};

exports.fetchExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find({});
        res.json(exercises);
    } catch (error) {
        console.error("Error fetching exercises:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};