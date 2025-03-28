const express = require('express');
const router = express.Router();
const healthPlanController = require('../controllers/healthPlanController');
const auth = require('../middlewares/auth');

router.post('/generate', auth.authenticate, healthPlanController.generateHealthPlan);
router.get('/', auth.authenticate, healthPlanController.getHealthPlan);

module.exports = router;
