import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="hero-bg-orb orb1" style={{ width: 400, height: 400, top: -150, left: -150 }} />
      <div className="hero-bg-orb orb2" style={{ width: 350, height: 350, bottom: -100, right: -100 }} />

      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div className="logo-icon">🚀</div>
            <div className="logo-name" style={{ fontSize: 20 }}>CareerAI</div>
          </Link>
          <div className="auth-title">Welcome Back</div>
          <div className="auth-subtitle">Sign in to your CareerAI account</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <><div className="spinner spinner-sm" /> Signing in...</> : '→ Sign In'}
          </button>
        </form>

        <div className="divider-text" style={{ margin: '24px 0' }}>or try demo</div>

        <button
          className="btn btn-ghost w-full"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => setForm({ email: 'demo@careerai.com', password: 'demo123456' })}
        >
          🧪 Fill Demo Credentials
        </button>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  );
}
