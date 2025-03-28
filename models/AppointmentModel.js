const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    motherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    doctorId: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true},
    appointmentType: {type: String, enum: ['emergency', 'scheduled', 'any'], default: 'any'},
    appointmentDate: {type: Date},
    appointmentTime: {type: String},
    url: {type: String},
    status: {type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending'},
    createdAt: {type: Date, default: Date.now},
    agoraToken: {type: String},
    channelName: {type: String},
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;