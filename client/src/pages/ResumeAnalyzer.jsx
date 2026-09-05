import { useState, useRef } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ScoreGauge from '../components/ScoreGauge';

const SAMPLE_RESUME = `JOHN DOE
Senior Frontend Developer
john.doe@email.com | LinkedIn: johndoe | GitHub: johndoe

SUMMARY
Experienced frontend developer with 5+ years building scalable web applications using React.js, TypeScript, and modern JavaScript. Passionate about performance optimization and user experience.

SKILLS
JavaScript, TypeScript, React.js, Next.js, HTML5, CSS3, Redux, GraphQL, REST APIs, Git, Jest, Webpack, Node.js, TailwindCSS

EXPERIENCE
Senior Frontend Developer | TechCorp | 2021 - Present
• Led development of customer dashboard using React and TypeScript
• Improved application performance by 40% through code optimization
• Implemented testing with Jest and React Testing Library
• Mentored 3 junior developers

Frontend Developer | StartupXYZ | 2019 - 2021  
• Built 15+ responsive UI components
• Integrated REST APIs and GraphQL endpoints
• Collaborated in agile sprints

EDUCATION
B.Tech in Computer Science | Tech University | 2019

CERTIFICATIONS
AWS Cloud Practitioner, Google Professional Developer`;

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');
  const fileRef = useRef();

  const handleFileChange = (f) => {
    if (!f) return;
    if (!['application/pdf', 'text/plain'].includes(f.type)) {
      return toast.error('Only PDF or TXT files are allowed');
    }
    setFile(f);
    setResumeText('');
    toast.success(`📎 ${f.name} attached`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFileChange(f);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !file) {
      return toast.error('Please paste your resume or upload a file');
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('resume', file);
      } else {
        formData.append('resumeText', resumeText);
      }
      const { data } = await api.post('/resume/analyze', formData);
      setAnalysis(data.analysis);
      toast.success('✅ Resume analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? 'var(--success)' : s >= 60 ? 'var(--warning)' : 'var(--error)';

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>📄 AI Resume Analyzer</div>
        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Upload or paste your resume to get a comprehensive AI analysis</div>
      </div>

      <div className="analyzer-layout">
        {/* Left — Input */}
        <div>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Resume Input</div>
                <div className="card-subtitle">{resumeText.length} characters</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setResumeText(''); setFile(null); }}>🗑 Clear</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setResumeText(SAMPLE_RESUME)}>📝 Sample</button>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
              style={{ marginBottom: 16, padding: 24 }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <div className="drop-zone-icon">📁</div>
              <div className="drop-zone-text">
                {file
                  ? <><strong>✅ {file.name}</strong> — ready to analyze</>
                  : <><strong>Drag & drop</strong> your PDF/TXT here, or <strong>click to browse</strong></>
                }
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt"
                style={{ display: 'none' }}
                onChange={e => handleFileChange(e.target.files[0])}
              />
            </div>

            {!file && (
              <>
                <div className="divider-text">or paste resume text</div>
                <textarea
                  className="form-textarea"
                  placeholder={`Paste your resume here...\n\nExample:\nNAME\nEmail | LinkedIn\n\nSKILLS\nJavaScript, React, Python...\n\nEXPERIENCE\n...`}
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  style={{ minHeight: 280, fontFamily: 'monospace', fontSize: 13 }}
                />
              </>
            )}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading
                ? <><div className="spinner spinner-sm" /> Analyzing with AI...</>
                : '🔍 Analyze Resume'}
            </button>
          </div>
        </div>

        {/* Right — Results */}
        <div className="analysis-section">
          {!analysis && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🤖</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>AI Analysis Results</div>
              <div style={{ color: 'var(--text-secondary)' }}>Your analysis results will appear here after you submit your resume.</div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto 20px' }} />
              <div style={{ fontSize: 16, fontWeight: 600 }}>Analyzing your resume...</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 8 }}>AI is scanning skills, checking ATS compatibility...</div>
            </div>
          )}

          {analysis && (
            <>
              {/* Score Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <ScoreGauge score={analysis.score} label="Resume Score" color="auto" size={130} />
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <ScoreGauge score={analysis.atsScore} label="ATS Score" color="#7c3aed" size={130} />
                </div>
              </div>

              {/* Meta */}
              <div className="card">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">👤 {analysis.experienceLevel || 'Professional'}</span>
                  <span className="badge badge-secondary">🎯 {analysis.primaryRole || 'Developer'}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>
                  {analysis.summary}
                </p>
              </div>

              {/* Tabs */}
              <div className="card">
                <div className="tabs" style={{ marginBottom: 20 }}>
                  {['skills', 'strengths', 'issues', 'suggestions'].map(t => (
                    <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                      {t === 'skills' ? '⚡ Skills' : t === 'strengths' ? '✅ Strengths' : t === 'issues' ? '⚠️ Gaps' : '💡 Tips'}
                    </button>
                  ))}
                </div>

                {activeTab === 'skills' && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--success)' }}>✅ Detected Skills ({analysis.skills?.length || 0})</div>
                    <div className="skills-wrap" style={{ marginBottom: 16 }}>
                      {(analysis.skills || []).map(s => <span key={s} className="skill-chip detected">{s}</span>)}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--error)' }}>❌ Missing Skills ({analysis.missingSkills?.length || 0})</div>
                    <div className="skills-wrap">
                      {(analysis.missingSkills || []).map(s => <span key={s} className="skill-chip missing">{s}</span>)}
                    </div>
                  </div>
                )}

                {activeTab === 'strengths' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(analysis.strengths || []).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
                        <span style={{ color: 'var(--success)' }}>✅</span>
                        <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'issues' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(analysis.weaknesses || []).map((w, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
                        <span style={{ color: 'var(--error)' }}>⚠️</span>
                        <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'suggestions' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(analysis.suggestions || []).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10 }}>
                        <span style={{ color: 'var(--info)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                        <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
