const EpdsResponse = require("../models/epdsTest/EpdsResponse");

// Save user EPDS response
exports.saveEpdsResponse = async (req, res) => {
    try {
        const { userId, responses, totalScore } = req.body;
        console.log(responses, userId, totalScore);
        if (!userId || !responses || totalScore === undefined) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const newResponse = new EpdsResponse({
            userId,
            responses,
            totalScore
        });

        await newResponse.save();
        res.status(201).json({ message: "Response saved successfully", newResponse });
    } catch (error) {
        console.error("Error saving EPDS response:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Fetch user responses
exports.fetchUserEpdsResponses = async (req, res) => {
    try {
        console.log("Function called");
        const { id } = req.user;

        console.log("Fetching responses for user:", id);
        const responses = await EpdsResponse.find({ userId: id }).sort({ createdAt: -1 }).select("-__v");

        if (!responses || responses.length === 0) { //Check for empty array
            return res.status(404).json({ message: "No responses found for this user" });
        }
        console.log("Responses found:", responses);
        res.status(200).json(responses);
    
    } catch (error) {
        console.error("Error fetching user EPDS responses:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};