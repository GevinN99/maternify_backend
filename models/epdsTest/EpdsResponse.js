const mongoose = require("mongoose");
const { Schema } = mongoose;

const EpdsResponseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    responses: [
        {
            question: String,
            selectedOption: String,
            score: Number
        }
    ],
    totalScore: Number,
    createdAt: { type: Date, default: Date.now }
});

const EpdsResponse = mongoose.model("EpdsResponse", EpdsResponseSchema);

module.exports = EpdsResponse;