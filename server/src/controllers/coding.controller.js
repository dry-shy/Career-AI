const groqService = require('../services/groq.service');
const InterviewSession = require('../models/InterviewSession');

// @desc    Generate a coding problem
// @route   POST /api/coding/problem
const generateProblem = async (req, res) => {
  try {
    const { role = 'Software Developer', difficulty = 'Medium', language = 'JavaScript' } = req.body;

    const problem = await groqService.generateCodingProblem(role, difficulty, language);

    const session = await InterviewSession.create({
      user: req.user._id,
      type: 'coding',
      role,
      codingProblem: {
        title: problem.title,
        description: `${problem.description}\n\nInput: ${problem.inputFormat}\nOutput: ${problem.outputFormat}`,
        difficulty: problem.difficulty,
        language
      },
      status: 'active'
    });

    res.json({ success: true, problem, sessionId: session._id });
  } catch (error) {
    console.error('Problem generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Evaluate submitted code
// @route   POST /api/coding/:sessionId/evaluate
const evaluateCode = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { code, language } = req.body;

    if (!code || code.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Please provide code to evaluate' });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const evaluation = await groqService.evaluateCode(
      session.codingProblem,
      code,
      language || session.codingProblem.language
    );

    // Update session with results
    session.codingProblem.userCode = code;
    session.codingProblem.evaluation = {
      correctness: evaluation.correctness,
      timeComplexity: evaluation.timeComplexity,
      spaceComplexity: evaluation.spaceComplexity,
      suggestions: evaluation.suggestions,
      score: evaluation.score
    };
    session.overallScore = evaluation.score;
    session.status = 'completed';
    await session.save();

    res.json({ success: true, evaluation });
  } catch (error) {
    console.error('Code evaluation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateProblem, evaluateCode };
