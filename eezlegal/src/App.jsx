import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import LoginModal from './components/LoginModal';
import { authAPI, isAuthenticated, getCurrentUser, clearAuthData } from './utils/api';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await authAPI.getCurrentUser();
          if (userData && userData.user) {
            setUser(userData.user);
            setIsLoggedIn(true);
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          clearAuthData();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData.user);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setIsLoggedIn(false);
    clearAuthData();
  };

  const handleQuestionSubmit = async (question) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    // Question will be handled by ChatInterface
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route 
            path="/" 
            element={
              isLoggedIn ? 
                <ChatInterface user={user} onLogout={handleLogout} /> : 
                <LandingPage onLogin={handleLogin} onQuestionSubmit={handleQuestionSubmit} />
            } 
          />
          <Route 
            path="/chat" 
            element={<ChatInterface user={user} onLogout={handleLogout} />} 
          />
        </Routes>
        
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </Router>
  );
}

export default App;

