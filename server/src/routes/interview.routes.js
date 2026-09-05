const express = require('express');
const router = express.Router();
const {
  generateQuestions,
  startMockInterview,
  submitAnswer,
  getSession,
  getInterviewHistory
} = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/questions', protect, generateQuestions);
router.post('/mock/start', protect, startMockInterview);
router.post('/mock/:sessionId/answer', protect, submitAnswer);
router.get('/history', protect, getInterviewHistory);
router.get('/:sessionId', protect, getSession);

module.exports = router;
