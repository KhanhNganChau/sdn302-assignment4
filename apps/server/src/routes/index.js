const express = require('express');
const router = express.Router();

router.use('/quizzes', require('./quiz'));
router.use('/questions', require('./question'));
router.use('/users', require('./user'));

module.exports = router;
