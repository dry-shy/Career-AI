import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobMatcher from './pages/JobMatcher';
import InterviewQuestions from './pages/InterviewQuestions';
import MockInterview from './pages/MockInterview';
import CodingInterview from './pages/CodingInterview';
import History from './pages/History';

// Protected layout with sidebar
function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner spinner-lg" style={{ margin: '0 auto 16px' }} />
        <div style={{ color: 'var(--text-secondary)' }}>Loading CareerAI...</div>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// Public route (redirect if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b27',
              color: '#f0f4ff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              fontSize: 14,
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected with sidebar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/job-match" element={<JobMatcher />} />
            <Route path="/questions" element={<InterviewQuestions />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/coding" element={<CodingInterview />} />
            <Route path="/history" element={<History />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
