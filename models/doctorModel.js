const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    experienceYears: { type: Number },
    specialization: { type: String },
    profileImage: { type: String },
    isOnline: { type: Boolean, default: false },
    role: { type: String, default: 'doctor' },
    googleMeetUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);