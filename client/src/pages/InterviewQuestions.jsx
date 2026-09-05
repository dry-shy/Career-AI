import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'UI/UX Designer', 'Product Manager', 'Android Developer', 'iOS Developer', 'Cloud Engineer', 'Machine Learning Engineer', 'QA Engineer'];
const EXPERIENCES = ['Fresher (0-1 years)', 'Junior (1-3 years)', 'Mid-level (3-5 years)', 'Senior (5-8 years)', 'Lead (8+ years)'];
const TECHNOLOGIES = ['JavaScript', 'Python', 'Java', 'TypeScript', 'React', 'Node.js', 'Spring Boot', 'Django', 'Flutter', 'AWS', 'Kubernetes', 'SQL', 'MongoDB', 'Go', 'Rust', 'C++', 'Swift', 'Kotlin'];

const DIFF_COLORS = { Easy: 'var(--success)', Medium: 'var(--warning)', Hard: 'var(--error)' };
const CAT_COLORS = { Technical: 'var(--primary)', Behavioral: 'var(--secondary)', 'System Design': 'var(--accent)', HR: 'var(--success)' };

export default function InterviewQuestions() {
  const [form, setForm] = useState({ role: '', experience: '', technology: '' });
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');

  const handleGenerate = async () => {
    if (!form.role || !form.experience || !form.technology) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    setQuestions([]);
    try {
      const { data } = await api.post('/interview/questions', form);
      setQuestions(data.questions);
      toast.success(`✅ Generated ${data.questions.length} questions!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Check API key.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(questions.map(q => q.category))];
  const filtered = filter === 'All' ? questions : questions.filter(q => q.category === filter);

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 900 }}>🧠 Interview Question Bank</div>
        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
          Get 12 personalized interview questions with ideal answers
        </div>
      </div>

      {/* Config Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title" style={{ marginBottom: 20 }}>Configure Your Interview</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Target Role</label>
            <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="">Select role...</option>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Experience Level</label>
            <select className="form-select" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}>
              <option value="">Select level...</option>
              {EXPERIENCES.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Primary Technology</label>
            <select className="form-select" value={form.technology} onChange={e => setForm(f => ({ ...f, technology: e.target.value }))}>
              <option value="">Select tech...</option>
              {TECHNOLOGIES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button
          className="btn btn-primary btn-lg"
          style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? <><div className="spinner spinner-sm" /> Generating questions...</> : '🧠 Generate Questions'}
        </button>
      </div>

      {/* Questions */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 20px' }} />
          <div style={{ fontWeight: 600 }}>AI is crafting your personalized questions...</div>
        </div>
      )}

      {questions.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button
                key={c}
                className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(c)}
              >
                {c} {c !== 'All' && <span style={{ opacity: 0.7 }}>({questions.filter(q => q.category === c).length})</span>}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((q, i) => (
              <div key={q.id || i} className="card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: 'var(--primary)', flexShrink: 0
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, marginBottom: 10 }}>
                      {q.question}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="badge" style={{ background: `${CAT_COLORS[q.category]}22`, color: CAT_COLORS[q.category] }}>
                        {q.category}
                      </span>
                      <span className="badge" style={{ background: `${DIFF_COLORS[q.difficulty]}22`, color: DIFF_COLORS[q.difficulty] }}>
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 20, flexShrink: 0, transform: expanded === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</span>
                </div>

                {expanded === i && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ padding: 14, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--info)', marginBottom: 6 }}>💡 HINT</div>
                      <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{q.hint}</div>
                    </div>
                    <div style={{ padding: 14, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 6 }}>✅ IDEAL ANSWER</div>
                      <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>{q.idealAnswer}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && questions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🧠</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Ready to Generate Questions</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Select your role, experience level, and technology to get personalized questions.
          </div>
        </div>
      )}
    </div>
  );
}
