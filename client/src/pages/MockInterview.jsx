import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ScoreGauge from '../components/ScoreGauge';

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager', 'Software Engineer'];
const EXPERIENCES = ['Fresher (0-1 years)', 'Junior (1-3 years)', 'Mid-level (3-5 years)', 'Senior (5-8 years)'];

export default function MockInterview() {
  const [phase, setPhase] = useState('setup'); // setup | interview | complete
  const [form, setForm] = useState({ role: 'Software Engineer', experience: 'Mid-level (3-5 years)' });
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [scores, setScores] = useState({ overall: 0, confidence: 0, clarity: 0, problemSolving: 0 });
  const [questionNumber, setQuestionNumber] = useState(0);
  const [revealIdeal, setRevealIdeal] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/interview/mock/start', form);
      setSessionId(data.sessionId);
      setMessages([{
        role: 'ai',
        content: `${data.greeting} ${data.question}`,
        category: data.category,
        difficulty: data.difficulty
      }]);
      setPhase('interview');
      setQuestionNumber(1);
      toast.success('🎤 Interview started!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || answer.trim().length < 10) {
      return toast.error('Please provide a more detailed answer');
    }
    setLoading(true);

    const userMsg = { role: 'user', content: answer };
    setMessages(prev => [...prev, userMsg]);
    const submittedAnswer = answer;
    setAnswer('');

    try {
      const { data } = await api.post(`/interview/mock/${sessionId}/answer`, { answer: submittedAnswer });
      const ev = data.evaluation;

      setEvaluation(ev);

      // Update the last user message with score/feedback
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], score: ev.score, feedback: ev.feedback, idealAnswer: ev.idealAnswer };
        return updated;
      });

      // Update running scores
      setScores({
        overall: ev.overallScore || Math.round((scores.overall + ev.score) / 2),
        confidence: ev.confidenceScore || scores.confidence,
        clarity: ev.clarityScore || scores.clarity,
        problemSolving: ev.problemSolvingScore || scores.problemSolving
      });

      if (data.isComplete) {
        setFinalResult(ev);
        setPhase('complete');
      } else {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: ev.nextQuestion,
          category: ev.nextCategory,
          difficulty: ev.nextDifficulty
        }]);
        setQuestionNumber(prev => prev + 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) submitAnswer();
    }
  };

  const resetInterview = () => {
    setPhase('setup');
    setMessages([]);
    setSessionId(null);
    setAnswer('');
    setEvaluation(null);
    setFinalResult(null);
    setScores({ overall: 0, confidence: 0, clarity: 0, problemSolving: 0 });
    setQuestionNumber(0);
    setRevealIdeal({});
  };

  // ─── SETUP PHASE ─────────────────────────────────────────────────────
  if (phase === 'setup') return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 900 }}>🤖 AI Mock Interview</div>
        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
          Practice with an AI interviewer that gives real-time feedback and scoring
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(124,58,237,0.08))', border: '1px solid rgba(255,107,53,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Ready for Your Mock Interview?</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
              5 questions • AI scoring • Real-time feedback • Ideal answers
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Target Role</label>
              <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Experience Level</label>
              <select className="form-select" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}>
                {EXPERIENCES.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '16px', background: 'var(--bg-card)', borderRadius: 12, marginBottom: 24 }}>
            {[['🧠', '5 Questions'], ['⚡', 'Live Scoring'], ['💡', 'AI Feedback'], ['🏆', 'Session Score']].map(([icon, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24 }}>{icon}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-xl"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={startInterview}
            disabled={loading}
          >
            {loading ? <><div className="spinner spinner-sm" /> Setting up interview...</> : '🎤 Start Mock Interview'}
          </button>
        </div>
      </div>
    </div>
  );

  // ─── COMPLETE PHASE ───────────────────────────────────────────────────
  if (phase === 'complete') return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Interview Complete!</div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          Here's your performance summary for the {form.role} role
        </div>

        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(124,58,237,0.08))' }}>
          <ScoreGauge score={finalResult?.overallScore || 0} label="Overall Score" color="auto" size={180} />
          <div className="score-metrics" style={{ marginTop: 24 }}>
            <div className="metric-item">
              <div className="metric-value">{finalResult?.confidenceScore || 0}</div>
              <div className="metric-label">Confidence</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{finalResult?.clarityScore || 0}</div>
              <div className="metric-label">Clarity</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{finalResult?.problemSolvingScore || 0}</div>
              <div className="metric-label">Problem Solving</div>
            </div>
          </div>
        </div>

        {finalResult?.sessionSummary && (
          <div className="card" style={{ textAlign: 'left', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>📝 AI Summary</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{finalResult.sessionSummary}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={resetInterview}>🔄 Try Again</button>
          <button className="btn btn-ghost btn-lg" onClick={() => window.location.href = '/history'}>📊 View History</button>
        </div>
      </div>
    </div>
  );

  // ─── INTERVIEW PHASE ──────────────────────────────────────────────────
  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>🤖 Mock Interview — {form.role}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Question {questionNumber} of 5</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-primary">🤖 AI Interviewer Active</span>
          <button className="btn btn-danger btn-sm" onClick={resetInterview}>End Interview</button>
        </div>
      </div>

      <div className="mock-layout">
        {/* Chat */}
        <div>
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i}>
                  <div className={`chat-message ${msg.role}`}>
                    <div className={`chat-avatar ${msg.role}`}>
                      {msg.role === 'ai' ? '🤖' : '👤'}
                    </div>
                    <div className={`chat-bubble ${msg.role}`}>
                      {msg.content}
                      {msg.role === 'ai' && msg.category && (
                        <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                          <span className="badge badge-primary" style={{ fontSize: 10 }}>{msg.category}</span>
                          {msg.difficulty && <span className="badge badge-ghost" style={{ fontSize: 10 }}>{msg.difficulty}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback for user answers */}
                  {msg.role === 'user' && msg.score !== undefined && (
                    <div style={{ marginLeft: 48, marginTop: 8, marginBottom: 8, animation: 'fadeIn 0.4s ease' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>
                          Score: <span style={{ color: msg.score >= 70 ? 'var(--success)' : msg.score >= 50 ? 'var(--warning)' : 'var(--error)' }}>{msg.score}/100</span>
                        </div>
                        <div className="progress-bar" style={{ flex: 1, height: 6 }}>
                          <div className="progress-fill" style={{ width: `${msg.score}%` }} />
                        </div>
                      </div>

                      {msg.feedback && (
                        <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, fontSize: 13, marginBottom: 8 }}>
                          💬 {msg.feedback}
                        </div>
                      )}

                      {msg.idealAnswer && (
                        <div>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setRevealIdeal(prev => ({ ...prev, [i]: !prev[i] }))}
                          >
                            {revealIdeal[i] ? '🙈 Hide Ideal Answer' : '💡 Reveal Ideal Answer'}
                          </button>
                          {revealIdeal[i] && (
                            <div style={{ marginTop: 8, padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, fontSize: 13, lineHeight: 1.7, animation: 'fadeIn 0.3s ease' }}>
                              <strong style={{ color: 'var(--success)', display: 'block', marginBottom: 4 }}>✅ Ideal Answer:</strong>
                              {msg.idealAnswer}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="chat-message ai">
                  <div className="chat-avatar ai">🤖</div>
                  <div className="chat-bubble ai">
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <div className="spinner spinner-sm" />
                      <span>Evaluating your answer...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder="Type your answer here... (Press Enter to submit, Shift+Enter for new line)"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={2}
              />
              <button
                className="btn btn-primary"
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
              >
                {loading ? <div className="spinner spinner-sm" /> : '→'}
              </button>
            </div>
          </div>
        </div>

        {/* Score Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>📊 Live Scoring</div>
            <ScoreGauge score={evaluation?.score || 0} label="Last Answer" color="auto" size={140} />

            <div className="divider" />

            <div className="score-metrics">
              <div className="metric-item">
                <div className="metric-value">{evaluation?.confidenceScore || 0}</div>
                <div className="metric-label">Confidence</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">{evaluation?.clarityScore || 0}</div>
                <div className="metric-label">Clarity</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">{evaluation?.problemSolvingScore || 0}</div>
                <div className="metric-label">Problem Solving</div>
              </div>
            </div>

            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              Real-time feedback on every answer
            </div>
          </div>

          {/* Progress */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>📍 Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                    background: n < questionNumber ? 'var(--success)' : n === questionNumber ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: n <= questionNumber ? 'white' : 'var(--text-muted)',
                  }}>
                    {n < questionNumber ? '✓' : n}
                  </div>
                  <div style={{ fontSize: 13, color: n <= questionNumber ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    Question {n}
                    {n < questionNumber && messages.find((m, i) => m.role === 'user' && Math.floor(i / 2) + 1 === n)?.score !== undefined && (
                      <span style={{ marginLeft: 6, color: 'var(--success)', fontSize: 11 }}>✓ Answered</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💡 Pro Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <div>• Use the STAR method (Situation, Task, Action, Result)</div>
              <div>• Be specific with metrics and numbers</div>
              <div>• Mention relevant technologies</div>
              <div>• Keep answers 2-3 minutes long</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
