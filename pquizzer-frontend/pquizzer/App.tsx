import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizRoom from './pages/QuizRoom';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import { User } from './types';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  const token = localStorage.getItem('pquizzer_token');
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedToken = localStorage.getItem('pquizzer_token');
    const savedUser = localStorage.getItem('pquizzer_user');
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('pquizzer_user');
        localStorage.removeItem('pquizzer_token');
      }
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('pquizzer_token', userData.token || 'mock-token');
    localStorage.setItem('pquizzer_user', JSON.stringify(userData));
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pquizzer_token');
    localStorage.removeItem('pquizzer_user');
    navigate('/login');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={handleLogout} currentPage={location.pathname} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute user={user}>
              <Dashboard onStartQuiz={(id) => navigate(`/quiz/${id}`)} />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={
            <Login onLoginSuccess={handleLogin} onNavigate={(path) => navigate(`/${path}`)} />
          } />
          
          <Route path="/register" element={
            <Register 
              onSuccess={() => navigate('/login')} 
              onNavigate={(path) => navigate(`/${path}`)} 
            />
          } />

          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <Profile user={user!} />
            </ProtectedRoute>
          } />

          <Route path="/quiz/:quizId" element={
            <ProtectedRoute user={user}>
              <QuizRoom 
                onComplete={(score) => { setLastScore(score); navigate('/results'); }} 
                onExit={() => navigate('/')} 
              />
            </ProtectedRoute>
          } />

          <Route path="/results" element={
            <div className="max-w-md mx-auto py-20 px-4 text-center">
              <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quiz Completed!</h2>
                <div className="text-6xl font-black text-indigo-600 my-8">{lastScore ?? 0}</div>
                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="py-8 bg-white border-t border-gray-50 text-center text-gray-400 text-xs">
        © 2024 PQuizzer Platform | Knowledge Unleashed
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;