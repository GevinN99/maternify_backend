const express = require('express');
const {
    registerDoctor,
    loginDoctor,
    getDoctorProfile,
    getAvailableDoctors,
    updateOnlineStatus,
    updateDoctorProfile,
    deleteDoctorProfile
} = require('../controllers/doctorController');
const { authenticate } = require('../middlewares/auth');
const router = express.Router();

// Public routes
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);

// Protected routes (require authentication)
router.get('/me', authenticate, getDoctorProfile);
router.put('/me', authenticate, updateDoctorProfile);
router.delete('/me', authenticate, deleteDoctorProfile);
router.put('/online-status', authenticate, updateOnlineStatus);
router.get('/available', getAvailableDoctors);

module.exports = router;