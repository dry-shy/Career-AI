const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// llama-3.3-70b-versatile was deprecated by Groq (shutdown 08/16/26).
// Recommended replacement: openai/gpt-oss-120b. Override via GROQ_MODEL in .env.
const getModel = () => process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

const generateJSON = async (prompt) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a specialized AI assistant. You must respond ONLY with valid JSON. Do not include markdown code blocks or any other text before or after the JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: getModel(),
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const text = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(text);
};

// ─── Resume Analysis ───────────────────────────────────────────────────────
const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert HR consultant and ATS optimization specialist. Analyze the following resume and return a comprehensive JSON response.

RESUME:
${resumeText}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "score": <number 0-100, overall resume quality>,
  "atsScore": <number 0-100, ATS compatibility score>,
  "skills": [<list of technical and soft skills detected>],
  "missingSkills": [<list of commonly required skills that are missing>],
  "strengths": [<3-5 key strengths of this resume>],
  "weaknesses": [<3-5 key weaknesses or gaps>],
  "suggestions": [<5-7 specific, actionable improvement suggestions>],
  "summary": "<2-3 sentence professional assessment of this candidate>",
  "experienceLevel": "<Fresher|Junior|Mid-level|Senior|Lead>",
  "primaryRole": "<detected primary job role e.g. Frontend Developer>"
}`;

  return await generateJSON(prompt);
};

// ─── Job Description Match ─────────────────────────────────────────────────
const matchJobDescription = async (resumeText, jobDescription) => {
  const prompt = `
You are an expert recruitment specialist. Compare this resume against the job description and provide a detailed match analysis.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON (no markdown) in this exact format:
{
  "matchPercentage": <number 0-100>,
  "matchedSkills": [<skills from resume that match job requirements>],
  "missingSkills": [<skills required by job but absent in resume>],
  "recommendations": [<5 specific recommendations to improve the match>],
  "jobTitle": "<extracted job title from JD>",
  "keyRequirements": [<top 5 requirements from the JD>],
  "fitSummary": "<2 sentence summary of how well this candidate fits>"
}`;

  return await generateJSON(prompt);
};

// ─── Interview Questions Generator ────────────────────────────────────────
const generateInterviewQuestions = async (role, experience, technology) => {
  const prompt = `
You are a senior technical interviewer at a top tech company. Generate interview questions for the following profile:

Role: ${role}
Experience Level: ${experience}
Primary Technology: ${technology}

Return ONLY valid JSON (no markdown) in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "<interview question>",
      "category": "<Technical|Behavioral|System Design|HR>",
      "difficulty": "<Easy|Medium|Hard>",
      "hint": "<brief hint for answering>",
      "idealAnswer": "<comprehensive ideal answer>"
    }
  ]
}

Generate exactly 12 questions: 5 technical, 3 behavioral, 2 system design, 2 HR. Mix difficulty levels appropriately for ${experience} level.`;

  return await generateJSON(prompt);
};

// ─── Mock Interview — First Question ─────────────────────────────────────
const startMockInterview = async (role, experience) => {
  const prompt = `
You are a professional interviewer conducting a ${experience}-level interview for a ${role} position.
Start the interview with a warm, professional greeting and your first question.
The question should be appropriate for ${experience} level.

Return ONLY valid JSON (no markdown):
{
  "greeting": "<warm professional opening statement>",
  "question": "<your first interview question>",
  "category": "<Technical|Behavioral|Introduction>",
  "difficulty": "<Easy|Medium|Hard>"
}`;

  return await generateJSON(prompt);
};

// ─── Mock Interview — Evaluate Answer & Ask Next ─────────────────────────
const evaluateAndContinue = async (role, experience, conversationHistory, userAnswer, questionNumber) => {
  const historyText = conversationHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  const isLastQuestion = questionNumber >= 5;

  const prompt = `
You are a professional interviewer for a ${role} (${experience} level) position.

CONVERSATION SO FAR:
${historyText}

CANDIDATE'S LATEST ANSWER: "${userAnswer}"

${isLastQuestion ? 'This is the FINAL question. After evaluating, provide a comprehensive session summary instead of asking another question.' : `This is question ${questionNumber} of 5. Ask the next question after evaluating.`}

Evaluate the answer and ${isLastQuestion ? 'provide session summary' : 'ask the next question'}.

Return ONLY valid JSON (no markdown):
{
  "score": <number 0-100 for this answer>,
  "feedback": "<specific, constructive feedback on the answer (2-3 sentences)>",
  "idealAnswer": "<what an ideal answer would include>",
  "confidenceScore": <0-100>,
  "clarityScore": <0-100>,
  "problemSolvingScore": <0-100>,
  ${isLastQuestion ? `"isComplete": true, "sessionSummary": "<overall performance summary>", "overallScore": <0-100>` : `"isComplete": false, "nextQuestion": "<your next interview question>", "nextCategory": "<Technical|Behavioral|System Design>", "nextDifficulty": "<Easy|Medium|Hard>"`}
}`;

  return await generateJSON(prompt);
};

// ─── Coding Problem Generator ─────────────────────────────────────────────
const generateCodingProblem = async (role, difficulty, language) => {
  const prompt = `
Generate a coding interview problem suitable for a ${role} role at ${difficulty} difficulty level.

Return ONLY valid JSON (no markdown):
{
  "title": "<problem title>",
  "description": "<complete problem description with examples>",
  "inputFormat": "<input format description>",
  "outputFormat": "<output format description>",
  "examples": [
    { "input": "<example input>", "output": "<example output>", "explanation": "<explanation>" }
  ],
  "constraints": ["<constraint 1>", "<constraint 2>"],
  "hints": ["<hint 1>", "<hint 2>"],
  "starterCode": "<starter code template in ${language}>",
  "difficulty": "${difficulty}"
}`;

  return await generateJSON(prompt);
};

// ─── Code Evaluation ─────────────────────────────────────────────────────
const evaluateCode = async (problem, userCode, language) => {
  const prompt = `
You are a senior software engineer reviewing a coding interview submission.

PROBLEM: ${problem.title}
${problem.description}

CANDIDATE'S ${language.toUpperCase()} CODE:
\`\`\`${language}
${userCode}
\`\`\`

Evaluate the code thoroughly.

Return ONLY valid JSON (no markdown):
{
  "correctness": <true|false>,
  "score": <number 0-100>,
  "timeComplexity": "<Big O notation e.g. O(n)>",
  "spaceComplexity": "<Big O notation e.g. O(1)>",
  "suggestions": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"],
  "codeQuality": "<Good|Average|Poor>",
  "feedback": "<detailed 3-4 sentence feedback>",
  "optimizedApproach": "<description of the most optimal approach>",
  "bugs": ["<bug 1 if any>"],
  "strengths": ["<what the candidate did well>"]
}`;

  return await generateJSON(prompt);
};

module.exports = {
  analyzeResume,
  matchJobDescription,
  generateInterviewQuestions,
  startMockInterview,
  evaluateAndContinue,
  generateCodingProblem,
  evaluateCode
};
