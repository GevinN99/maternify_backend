const auth = require('../middlewares/auth');
const express = require('express');
const { saveEpdsResponse, fetchUserEpdsResponses } = require('../controllers/quizController');

const router = express.Router();

router.post('/submit-response',auth.authenticate, saveEpdsResponse);
router.get('/get-response',auth.authenticate, fetchUserEpdsResponses);

module.exports = router;