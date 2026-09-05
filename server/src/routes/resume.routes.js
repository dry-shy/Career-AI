const express = require('express');
const router = express.Router();
const { analyzeResume, matchJob, getHistory } = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/analyze', protect, upload.single('resume'), analyzeResume);
router.post('/match', protect, matchJob);
router.get('/history', protect, getHistory);

module.exports = router;
