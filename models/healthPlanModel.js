const mongoose = require('mongoose');

const healthPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: { type: Number, required: true },
    //weight: { type: Number, required: true },
    medicalHistory: { type: [String], required: true },
    pregnancyStage: { type: String, required: true },
    planDetails: { type: String, required: true }, // AI-generated health plan
}, { timestamps: true }); // Auto-manages createdAt & updatedAt

module.exports = mongoose.model('HealthPlan', healthPlanSchema);
