const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Quiz API is running',
	});
});

router.get('/health', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'OK',
	});
});

router.use('/quizzes', require('./quiz'));
router.use('/questions', require('./question'));
router.use('/users', require('./user'));

module.exports = router;
