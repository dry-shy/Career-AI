import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('interviews');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sessRes, anaRes] = await Promise.all([
          api.get('/interview/history'),
          api.get('/resume/history')
        ]);
        setSessions(sessRes.data.sessions || []);
        setAnalyses(anaRes.data.analyses || []);
      } catch (err) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const typeLabels = { mock: '🤖 Mock Interview', questions: '🧠 Question Bank', coding: '💻 Coding' };
  const statusColor = { completed: 'var(--success)', active: 'var(--warning)' };

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 900 }}>📊 History</div>
        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>All your past interviews and resume analyses</div>
      </div>

      <div className="tabs" style={{ maxWidth: 400, marginBottom: 24 }}>
        <button className={`tab-btn ${tab === 'interviews' ? 'active' : ''}`} onClick={() => setTab('interviews')}>
          🤖 Interviews ({sessions.length})
        </button>
        <button className={`tab-btn ${tab === 'analyses' ? 'active' : ''}`} onClick={() => setTab('analyses')}>
          📄 Analyses ({analyses.length})
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-secondary)' }}>Loading history...</div>
        </div>
      )}

      {!loading && tab === 'interviews' && (
        <>
          {sessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 64 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🤖</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>No interviews yet</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Start your first mock interview to see results here</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sessions.map(s => (
                <div key={s._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ fontSize: 36, flexShrink: 0 }}>
                    {s.type === 'mock' ? '🤖' : s.type === 'coding' ? '💻' : '🧠'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{typeLabels[s.type] || s.type}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {s.role && <span className="badge badge-ghost">{s.role}</span>}
                      {s.experience && <span className="badge badge-ghost">{s.experience}</span>}
                      {s.technology && <span className="badge badge-ghost">{s.technology}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                      {new Date(s.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>{s.overallScore || '--'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score</div>
                    <span className="badge" style={{ background: `${statusColor[s.status]}22`, color: statusColor[s.status], fontSize: 11, marginTop: 6 }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && tab === 'analyses' && (
        <>
          {analyses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 64 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>No analyses yet</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Analyze your resume to see results here</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {analyses.map(a => (
                <div key={a._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ fontSize: 36, flexShrink: 0 }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Resume Analysis</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {a.analysis?.experienceLevel && <span className="badge badge-ghost">{a.analysis.experienceLevel}</span>}
                      {a.analysis?.primaryRole && <span className="badge badge-primary">{a.analysis.primaryRole}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>{a.analysis?.score || '--'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Resume Score</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--secondary)', marginTop: 4 }}>{a.analysis?.atsScore || '--'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ATS Score</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
