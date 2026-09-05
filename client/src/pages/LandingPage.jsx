import { Link } from 'react-router-dom';

const features = [
  {
    icon: '📄',
    title: 'AI Resume Analyzer',
    desc: 'Upload your resume and get instant AI-powered analysis including ATS score, skill gaps, strengths, weaknesses, and tailored improvement suggestions.',
    color: 'linear-gradient(135deg, #ff6b35, #ff8c6b)',
    badge: 'Most Popular'
  },
  {
    icon: '🎯',
    title: 'Job Description Matcher',
    desc: 'Paste any job description and AI will compare it to your resume, showing your match percentage and exactly which skills you need to add.',
    color: 'linear-gradient(135deg, #7c3aed, #9b5df5)',
    badge: 'Smart Match'
  },
  {
    icon: '🧠',
    title: 'Interview Question Bank',
    desc: 'Get a personalized set of 12 interview questions based on your target role, experience level, and technology stack — with ideal answers.',
    color: 'linear-gradient(135deg, #06b6d4, #38bdf8)',
    badge: 'Personalized'
  },
  {
    icon: '🤖',
    title: 'AI Mock Interview',
    desc: 'Practice with an AI interviewer that evaluates your answers in real-time, scores your confidence and clarity, and reveals the ideal answers.',
    color: 'linear-gradient(135deg, #10b981, #34d399)',
    badge: '⭐ Best Feature'
  },
  {
    icon: '💻',
    title: 'Coding Interview',
    desc: 'Solve AI-generated coding problems and get instant evaluation of your solution — correctness, time/space complexity, and optimization tips.',
    color: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    badge: 'Code Review'
  },
  {
    icon: '📊',
    title: 'Career Dashboard',
    desc: 'Track your career score, interview performance over time, skill growth, and get insights on how to improve your professional profile.',
    color: 'linear-gradient(135deg, #ef4444, #f87171)',
    badge: 'Analytics'
  },
];

const stats = [
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '98%', label: 'ATS Accuracy' },
  { value: '12K+', label: 'Mock Interviews' },
  { value: '4.9★', label: 'User Rating' },
];

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="logo-icon">🚀</div>
          <div>
            <div className="logo-name">CareerAI</div>
            <div className="logo-tagline">AI Career Assistant</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-bg-orb orb1" />
        <div className="hero-bg-orb orb2" />

        <div className="hero-badge animate-fade-in">
          <span>✨</span> Powered by Google Gemini AI
        </div>

        <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Land Your Dream Job<br />with AI Superpowers
        </h1>

        <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Analyze your resume, match job descriptions, practice mock interviews,
          and conquer coding challenges — all in one AI-powered platform.
        </p>

        <div className="hero-buttons animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link to="/register" className="btn btn-primary btn-xl">
            🚀 Start for Free
          </Link>
          <Link to="/login" className="btn btn-ghost btn-xl">
            Sign In →
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: 48,
          marginTop: 64,
          padding: '24px 48px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          backdropFilter: 'blur(10px)',
        }} className="animate-fade-in">
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 48px' }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>
            Everything You Need to{' '}
            <span style={{ color: 'var(--primary)' }}>Get Hired</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>
            5 powerful AI tools built specifically for job seekers and career switchers.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ background: f.color }}>
                {f.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div className="feature-title">{f.title}</div>
                <span className="badge badge-primary" style={{ fontSize: 10 }}>{f.badge}</span>
              </div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(124,58,237,0.1))',
          border: '1px solid rgba(255,107,53,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '64px 48px',
          maxWidth: 800,
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16, letterSpacing: -1 }}>
            Ready to Supercharge<br/>Your Career?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 40 }}>
            Join thousands of job seekers using AI to get hired faster.
          </p>
          <Link to="/register" className="btn btn-primary btn-xl">
            🚀 Get Started — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        © 2026 CareerAI — AI-Powered Career Assistant. Built with MERN + Google Gemini AI.
      </footer>
    </div>
  );
}
