const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  analysis: {
    score: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },
    skills: [String],
    missingSkills: [String],
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    summary: { type: String, default: '' }
  },
  jobDescription: {
    type: String,
    default: ''
  },
  jobMatch: {
    matchPercentage: { type: Number, default: 0 },
    matchedSkills: [String],
    missingSkills: [String],
    recommendations: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
