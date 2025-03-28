const express = require('express');
const {
    createAppointment,
    getDoctorAppointments,
    cancelAppointment,
    getAvailableAppointments,
    bookAppointment,
    getUserBookedAppointments
} = require('../controllers/appointmentController');
const {authenticate} = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticate, createAppointment);
router.get('/doctor', authenticate, getDoctorAppointments);
router.delete('/cancel/:appointmentId', authenticate, cancelAppointment);
router.get('/available', authenticate, getAvailableAppointments);
router.post('/book', authenticate, bookAppointment);
router.get('/my-booked', authenticate, getUserBookedAppointments);

module.exports = router;