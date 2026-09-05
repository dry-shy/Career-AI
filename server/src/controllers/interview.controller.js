const groqService = require('../services/groq.service');
const InterviewSession = require('../models/InterviewSession');
const User = require('../models/User');

// @desc    Generate interview questions
// @route   POST /api/interview/questions
const generateQuestions = async (req, res) => {
  try {
    const { role, experience, technology } = req.body;

    if (!role || !experience || !technology) {
      return res.status(400).json({ success: false, message: 'Role, experience, and technology are required' });
    }

    const result = await groqService.generateInterviewQuestions(role, experience, technology);

    const session = await InterviewSession.create({
      user: req.user._id,
      type: 'questions',
      role,
      experience,
      technology,
      questions: result.questions,
      status: 'completed'
    });

    res.json({ success: true, questions: result.questions, sessionId: session._id });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start a mock interview session
// @route   POST /api/interview/mock/start
const startMockInterview = async (req, res) => {
  try {
    const { role, experience } = req.body;

    if (!role || !experience) {
      return res.status(400).json({ success: false, message: 'Role and experience level are required' });
    }

    const aiResponse = await groqService.startMockInterview(role, experience);

    const session = await InterviewSession.create({
      user: req.user._id,
      type: 'mock',
      role,
      experience,
      messages: [{
        role: 'ai',
        content: `${aiResponse.greeting} ${aiResponse.question}`,
        category: aiResponse.category,
        difficulty: aiResponse.difficulty
      }],
      status: 'active'
    });

    res.json({
      success: true,
      sessionId: session._id,
      greeting: aiResponse.greeting,
      question: aiResponse.question,
      category: aiResponse.category,
      difficulty: aiResponse.difficulty
    });
  } catch (error) {
    console.error('Mock interview start error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit answer in mock interview
// @route   POST /api/interview/mock/:sessionId/answer
const submitAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answer } = req.body;

    if (!answer || answer.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Please provide a valid answer' });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Interview session already completed' });
    }

    // Add user message
    session.messages.push({ role: 'user', content: answer });
    const questionNumber = session.messages.filter(m => m.role === 'user').length;

    const evaluation = await groqService.evaluateAndContinue(
      session.role,
      session.experience,
      session.messages,
      answer,
      questionNumber
    );

    // Update last user message with scores
    const lastUserMsg = session.messages[session.messages.length - 1];
    lastUserMsg.score = evaluation.score;
    lastUserMsg.feedback = evaluation.feedback;
    lastUserMsg.idealAnswer = evaluation.idealAnswer;

    if (!evaluation.isComplete) {
      session.messages.push({
        role: 'ai',
        content: evaluation.nextQuestion,
        category: evaluation.nextCategory,
        difficulty: evaluation.nextDifficulty
      });
    } else {
      session.status = 'completed';
      session.overallScore = evaluation.overallScore;
      session.confidenceScore = evaluation.confidenceScore;
      session.clarityScore = evaluation.clarityScore;
      session.problemSolvingScore = evaluation.problemSolvingScore;

      // Update user stats
      await User.findByIdAndUpdate(session.user, {
        $inc: { totalInterviews: 1 }
      });
    }

    await session.save();

    res.json({
      success: true,
      evaluation,
      isComplete: evaluation.isComplete,
      session: evaluation.isComplete ? session : null
    });
  } catch (error) {
    console.error('Answer submission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get session details
// @route   GET /api/interview/:sessionId
const getSession = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user interview history
// @route   GET /api/interview/history
const getInterviewHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-messages -questions');

    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateQuestions, startMockInterview, submitAnswer, getSession, getInterviewHistory };
