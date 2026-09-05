const express = require('express');
const router = express.Router();
const { generateProblem, evaluateCode } = require('../controllers/coding.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/problem', protect, generateProblem);
router.post('/:sessionId/evaluate', protect, evaluateCode);

module.exports = router;
