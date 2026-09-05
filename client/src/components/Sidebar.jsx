import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/resume', icon: '📄', label: 'Resume Analyzer' },
  { to: '/job-match', icon: '🎯', label: 'Job Matcher' },
  { to: '/questions', icon: '🧠', label: 'Interview Q&A' },
  { to: '/mock-interview', icon: '🤖', label: 'Mock Interview', badge: 'AI' },
  { to: '/coding', icon: '💻', label: 'Coding Interview' },
  { to: '/history', icon: '📊', label: 'History' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🚀</div>
        <div className="logo-text">
          <div className="logo-name">CareerAI</div>
          <div className="logo-tagline">AI Career Assistant</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card" onClick={handleLogout} title="Click to logout">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">Click to logout</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>↩</span>
        </div>
      </div>
    </aside>
  );
}
