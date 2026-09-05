import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SAMPLE_JD = `Senior React Developer — Remote

We are looking for an experienced React developer to join our team.

Requirements:
- 4+ years of experience with React.js and modern JavaScript (ES6+)
- Strong knowledge of TypeScript
- Experience with Redux or Zustand for state management
- Proficiency with REST APIs and GraphQL
- Familiarity with Node.js and Express
- Experience with Docker and CI/CD pipelines
- Knowledge of AWS or GCP cloud services
- Experience with testing frameworks (Jest, Cypress)
- Strong understanding of responsive design and CSS
- Experience with Next.js is a plus
- Excellent problem-solving and communication skills

Nice to have:
- Experience with Kubernetes
- MongoDB knowledge
- Contributions to open source projects`;

export default function JobMatcher() {
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!jd.trim()) return toast.error('Please enter a job description');
    setLoading(true);
    try {
      const { data } = await api.post('/resume/match', { jobDescription: jd });
      setResult(data.jobMatch);
      toast.success('✅ Job match complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Match failed. Make sure you have analyzed a resume first.');
    } finally {
      setLoading(false);
    }
  };

  const matchColor = (p) => p >= 80 ? 'var(--success)' : p >= 60 ? 'var(--warning)' : 'var(--error)';
  const matchLabel = (p) => p >= 80 ? 'Strong Match ✅' : p >= 60 ? 'Good Match ⚠️' : 'Weak Match ❌';

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 900 }}>🎯 Job Description Matcher</div>
        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
          Compare your resume against any job description to see your match percentage
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Input */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Job Description</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setJd(SAMPLE_JD)}>📋 Sample JD</button>
          </div>
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            💡 Make sure you've analyzed your resume first on the Resume Analyzer page.
          </div>
          <textarea
            className="form-textarea"
            placeholder="Paste the job description here..."
            value={jd}
            onChange={e => setJd(e.target.value)}
            style={{ minHeight: 360, fontSize: 14 }}
          />
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
            onClick={handleMatch}
            disabled={loading}
          >
            {loading
              ? <><div className="spinner spinner-sm" /> Analyzing match...</>
              : '🎯 Analyze Match'}
          </button>
        </div>

        {/* Results */}
        <div>
          {!result && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: 64 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Match Results</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Enter a job description and click Analyze Match</div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 64 }}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto 20px' }} />
              <div style={{ fontWeight: 600 }}>Comparing your profile...</div>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Match Score */}
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(124,58,237,0.08))' }}>
                <div style={{ fontSize: 80, fontWeight: 900, color: matchColor(result.matchPercentage), lineHeight: 1 }}>
                  {result.matchPercentage}%
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: matchColor(result.matchPercentage), marginTop: 8 }}>
                  {matchLabel(result.matchPercentage)}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
                  for {result.jobTitle || 'this role'}
                </div>
                <div className="progress-bar" style={{ marginTop: 16, height: 12 }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${result.matchPercentage}%`, background: matchColor(result.matchPercentage) }}
                  />
                </div>
              </div>

              {/* Matched Skills */}
              <div className="card">
                <div style={{ fontWeight: 700, marginBottom: 12, color: 'var(--success)' }}>
                  ✅ Matched Skills ({result.matchedSkills?.length || 0})
                </div>
                <div className="skills-wrap">
                  {(result.matchedSkills || []).map(s => (
                    <span key={s} className="skill-chip detected">{s}</span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="card">
                <div style={{ fontWeight: 700, marginBottom: 12, color: 'var(--error)' }}>
                  ❌ Missing Skills ({result.missingSkills?.length || 0})
                </div>
                <div className="skills-wrap">
                  {(result.missingSkills || []).map(s => (
                    <span key={s} className="skill-chip missing">{s}</span>
                  ))}
                </div>
              </div>

              {/* Key Requirements */}
              {result.keyRequirements?.length > 0 && (
                <div className="card">
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>📋 Key Requirements</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.keyRequirements.map((r, i) => (
                      <div key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                        <span style={{ color: 'var(--primary)', flexShrink: 0 }}>•</span>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="card">
                <div style={{ fontWeight: 700, marginBottom: 12 }}>💡 Recommendations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(result.recommendations || []).map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'rgba(59,130,246,0.08)', borderRadius: 8, fontSize: 13 }}>
                      <span style={{ color: 'var(--info)', flexShrink: 0 }}>{i + 1}.</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {result.fitSummary && (
                <div className="card" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--success)' }}>🔍 AI Assessment</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{result.fitSummary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
