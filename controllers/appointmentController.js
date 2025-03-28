const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');

exports.createAppointment = async (req, res) => {
    try {
        console.log("Creating appointment with data:", {
            user: req.user,
            body: req.body,
        });

        const doctorId = req.user.id;
        if (!doctorId) {
            return res.status(401).json({ message: "Unauthorized: Doctor ID not found" });
        }

        const { appointmentType, appointmentDate, appointmentTime } = req.body;
        if (!appointmentType || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newAppointment = new Appointment({
            appointmentType,
            appointmentDate: new Date(appointmentDate),
            appointmentTime,
            doctorId,
            motherId: null,
        });

        console.log("New appointment object:", newAppointment.toObject());
        await newAppointment.save();
        console.log("Appointment saved successfully:", newAppointment.toObject());

        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Error in createAppointment:", error.stack);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Doctor fetches their appointments
exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const appointments = await Appointment.find({ doctorId })
            .populate("motherId", "fullName");

        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Doctor cancels an appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { appointmentId } = req.params;

        const appointment = await Appointment.findOne({ _id: appointmentId, doctorId });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or not authorized to cancel" });
        }

        await Appointment.findByIdAndDelete(appointmentId);
        res.status(200).json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// User fetches available appointments
exports.getAvailableAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ motherId: null })
            .populate("doctorId", "fullName specialization experienceYears");
        console.log("Available Appointments:", appointments);
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// User books an appointment (Generate Agora token here)
exports.bookAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const appointment = await Appointment.findOne({ _id: appointmentId, status: "pending" });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or already booked" });
        }

        const doctor = await Doctor.findById(appointment.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        appointment.motherId = user._id;
        appointment.status = "confirmed";
        appointment.url = doctor.googleMeetUrl;

        await appointment.save();

        res.status(200).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// User fetches their booked appointments
exports.getUserBookedAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching confirmed appointments for userId:", userId);
        const appointments = await Appointment.find({
            motherId: userId,
            status: "confirmed"
        })
            .populate("doctorId", "fullName specialization experienceYears");
        console.log("Found appointments:", appointments);
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};