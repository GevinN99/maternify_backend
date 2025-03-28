const express = require('express');
const { sendMessageToChatGPT, getChatHistory } = require('../controllers/chatController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/send', auth.authenticate, sendMessageToChatGPT);
router.get('/history', auth.authenticate, getChatHistory);

module.exports = router;
