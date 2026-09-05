const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['ai', 'user'], required: true },
  content: { type: String, required: true },
  score: { type: Number, default: null },
  feedback: { type: String, default: '' },
  idealAnswer: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['mock', 'questions', 'coding'],
    required: true
  },
  role: { type: String, default: '' },
  experience: { type: String, default: '' },
  technology: { type: String, default: '' },
  messages: [messageSchema],
  overallScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  clarityScore: { type: Number, default: 0 },
  problemSolvingScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  questions: [{
    question: String,
    difficulty: String,
    category: String,
    hint: String,
    idealAnswer: String
  }],
  codingProblem: {
    title: String,
    description: String,
    difficulty: String,
    language: String,
    userCode: String,
    evaluation: {
      correctness: Boolean,
      timeComplexity: String,
      spaceComplexity: String,
      suggestions: [String],
      score: Number
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
