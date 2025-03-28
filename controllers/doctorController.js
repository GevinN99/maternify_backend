const Doctor = require('../models/doctorModel');
const { hashPassword } = require('../middlewares/auth');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

exports.registerDoctor = async (req, res) => {
    try {
        const { fullName, email, password, experienceYears, specialization, profileImage, isOnline, googleMeetUrl } = req.body;
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const newDoctor = new Doctor({
            fullName,
            email,
            password: hashedPassword,
            experienceYears,
            specialization,
            profileImage,
            isOnline: isOnline || false,
            googleMeetUrl: googleMeetUrl || `https://meet.google.com/${generateUniqueCode()}`,
        });
        await newDoctor.save();
        res.status(201).json({ message: 'Doctor registered successfully', doctor: newDoctor });
    } catch (error) {
        console.error("Register Doctor Error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// unique code generation (not used with Google Meet directly)
function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 10); // eg: "abc123xy"
}

exports.loginDoctor = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt with:", { email });
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            console.log("Doctor not found for email:", email);
            return res.status(404).json({ message: "Doctor not found" });
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            console.log("Password mismatch for email:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: doctor._id, role: "doctor" },
            SECRET_KEY,
            { expiresIn: "24h" }
        );
        res.status(200).json({
            token,
            userId: doctor._id,
            message: "Doctor logged in successfully",
        });
    } catch (error) {
        console.error("Doctor Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getDoctorProfile = async (req, res) => {
    try {
        console.log("Fetching profile for doctor ID:", req.user.id);
        const doctor = await Doctor.findById(req.user.id).select('-password');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        console.error("Get Doctor Profile Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOnlineStatus = async (req, res) => {
    const { isOnline } = req.body;
    try {
        console.log("Updating online status for doctor ID:", req.user.id, "to:", isOnline);
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        doctor.isOnline = isOnline;
        await doctor.save();
        console.log("Updated doctor document:", doctor);
        res.json({ message: 'Online status updated', isOnline: doctor.isOnline });
    } catch (error) {
        console.error("Update Online Status Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { fullName, experienceYears, specialization, profileImage } = req.body;
        console.log("Updating profile for doctor ID:", doctorId, "with:", req.body);

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { fullName, experienceYears, specialization, profileImage },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor profile updated successfully', doctor: updatedDoctor });
    } catch (error) {
        console.error("Update Doctor Profile Error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.user.id;
        console.log("Deleting profile for doctor ID:", doctorId);
        const doctor = await Doctor.findByIdAndDelete(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor profile deleted successfully' });
    } catch (error) {
        console.error("Delete Doctor Profile Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAvailableDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ isOnline: true }).select('-password');
        console.log("Available Doctors:", doctors);
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching available doctors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};