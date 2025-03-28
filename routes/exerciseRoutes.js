const express = require('express');
const router = express.Router();
const { addExercise, fetchExercises } = require('../controllers/exerciseController');

router.post('/add-exercise', addExercise);
router.get('/fetch-exercises', fetchExercises);

module.exports = router;