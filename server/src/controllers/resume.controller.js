const pdfParse = require('pdf-parse');
const groqService = require('../services/groq.service');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');

// @desc    Analyze resume (text or uploaded file)
// @route   POST /api/resume/analyze
const analyzeResume = async (req, res) => {
  try {
    let resumeText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(req.file.buffer);
        resumeText = data.text;
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ success: false, message: 'Please provide resume text or upload a file' });
    }

    if (resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Resume text is too short' });
    }

    const analysis = await groqService.analyzeResume(resumeText);

    // Save to DB
    const savedAnalysis = await ResumeAnalysis.create({
      user: req.user._id,
      resumeText,
      analysis
    });

    // Update user resume & score
    await User.findByIdAndUpdate(req.user._id, {
      resumeText,
      careerScore: analysis.atsScore,
      $inc: { totalAnalyses: 1 }
    });

    res.json({ success: true, analysis, analysisId: savedAnalysis._id });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Match resume against job description
// @route   POST /api/resume/match
const matchJob = async (req, res) => {
  try {
    const { jobDescription, analysisId } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ success: false, message: 'Job description is required' });
    }

    // Get resume text from saved analysis or user profile
    let resumeText = '';
    if (analysisId) {
      const analysis = await ResumeAnalysis.findById(analysisId);
      if (analysis) resumeText = analysis.resumeText;
    }

    if (!resumeText) {
      const user = await User.findById(req.user._id);
      resumeText = user.resumeText;
    }

    if (!resumeText) {
      return res.status(400).json({ success: false, message: 'Please analyze your resume first' });
    }

    const jobMatch = await groqService.matchJobDescription(resumeText, jobDescription);

    // Update the last analysis with job match data
    await ResumeAnalysis.findOneAndUpdate(
      { user: req.user._id },
      { jobDescription, jobMatch },
      { sort: { createdAt: -1 } }
    );

    res.json({ success: true, jobMatch });
  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all analyses for user
// @route   GET /api/resume/history
const getHistory = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-resumeText -jobDescription');

    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeResume, matchJob, getHistory };
