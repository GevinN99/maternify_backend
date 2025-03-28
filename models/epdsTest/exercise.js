const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    minScore: { type: Number, required: true },
    maxScore: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);