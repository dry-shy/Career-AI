import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ScoreGauge from '../components/ScoreGauge';

const quickActions = [
  { icon: '📄', title: 'Analyze Resume', desc: 'Upload & get AI analysis', to: '/resume', color: 'var(--primary)' },
  { icon: '🎯', title: 'Match Job', desc: 'Compare with JD', to: '/job-match', color: 'var(--secondary)' },
  { icon: '🤖', title: 'Mock Interview', desc: 'Practice with AI', to: '/mock-interview', color: 'var(--accent)' },
  { icon: '💻', title: 'Coding Test', desc: 'Solve coding problems', to: '/coding', color: 'var(--success)' },
];

const tips = [
  { icon: '💡', text: 'Tailor your resume to each job posting for a higher match score' },
  { icon: '🎯', text: 'Practice mock interviews until your confidence score hits 80+' },
  { icon: '📈', text: 'Add measurable achievements (e.g., "Improved performance by 40%")' },
  { icon: '🔑', text: 'Use keywords from the job description throughout your resume' },
];

export default function Dashboard() {
  const { user } = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'there';
  const score = user?.careerScore || 0;
  const interviews = user?.totalInterviews || 0;
  const analyses = user?.totalAnalyses || 0;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>
          {getGreeting()}, {firstName}! 👋
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>
          Here's your career progress at a glance.
        </div>
      </div>

      {/* Stats Row */}
      <div className="dashboard-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card orange">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Career Score</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--primary)' }}>{score}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>out of 100 points</div>
            </div>
            <span style={{ fontSize: 36 }}>🏆</span>
          </div>
          <div className="progress-bar" style={{ marginTop: 16 }}>
            <div className="progress-fill" style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="stat-card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Interviews Done</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--secondary)' }}>{interviews}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>mock sessions</div>
            </div>
            <span style={{ fontSize: 36 }}>🤖</span>
          </div>
        </div>

        <div className="stat-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Resumes Analyzed</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent)' }}>{analyses}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>AI analyses</div>
            </div>
            <span style={{ fontSize: 36 }}>📄</span>
          </div>
        </div>

        <div className="stat-card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Target Role</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)', lineHeight: 1.2 }}>
                {user?.targetRole || 'Not set'}
              </div>
            </div>
            <span style={{ fontSize: 36 }}>🎯</span>
          </div>
          <Link to="/questions" className="btn btn-ghost btn-sm" style={{ marginTop: 12, fontSize: 12 }}>
            Set target role →
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        {/* Quick Actions */}
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>⚡ Quick Actions</div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to} className="quick-action-card">
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: `${action.color}22`,
                  border: `1px solid ${action.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  flexShrink: 0
                }}>
                  {action.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{action.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{action.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 18 }}>→</span>
              </Link>
            ))}
          </div>

          {/* Pro Tips */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>💡 Career Tips</div>
            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Career Score Panel */}
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📊 Career Profile</div>
          <div className="card" style={{ textAlign: 'center' }}>
            <ScoreGauge score={score} label="Career Score" color="auto" size={160} />

            <div className="divider" style={{ margin: '20px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 12, background: 'var(--bg-elevated)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{analyses}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Analyses</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg-elevated)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--secondary)' }}>{interviews}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Interviews</div>
              </div>
            </div>

            <div className="divider" style={{ margin: '20px 0' }} />

            <Link to="/resume" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              📄 Analyze Resume Now
            </Link>
          </div>

          {/* Start Guide */}
          <div className="card" style={{ marginTop: 20, background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(124,58,237,0.08))', border: '1px solid rgba(255,107,53,0.2)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🗺️ Getting Started</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { step: 1, label: 'Analyze your resume', link: '/resume', done: analyses > 0 },
                { step: 2, label: 'Match a job description', link: '/job-match', done: false },
                { step: 3, label: 'Practice mock interview', link: '/mock-interview', done: interviews > 0 },
                { step: 4, label: 'Solve coding problems', link: '/coding', done: false },
              ].map(item => (
                <Link key={item.step} to={item.link} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
                    background: item.done ? 'var(--success)' : 'var(--bg-card)',
                    color: item.done ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${item.done ? 'var(--success)' : 'var(--border)'}`,
                  }}>
                    {item.done ? '✓' : item.step}
                  </div>
                  <span style={{ fontSize: 13, color: item.done ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: item.done ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                  {!item.done && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 12 }}>→</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
