import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('eezlegal_user');
      const savedAuth = localStorage.getItem('eezlegal_auth');
      
      if (savedUser && savedAuth === 'true') {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, method = 'email') => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        email,
        name: email.split('@')[0],
        method,
        loginTime: new Date().toISOString()
      };

      setUser(userData);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('eezlegal_user', JSON.stringify(userData));
      localStorage.setItem('eezlegal_auth', 'true');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eezlegal_user');
    localStorage.removeItem('eezlegal_auth');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
