import React, { useState } from 'react';

const EezLegalApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsive design
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation function
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Login function
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    setShowWelcomeModal(false);
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // HomePage Component - Professional Landing Page
  const HomePage = () => (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        padding: isMobile ? '1rem' : '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold' }}>
          Eezlegal
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: isMobile ? '0.5rem' : '0' }}>
          <button 
            onClick={() => setShowWelcomeModal(true)}
            style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => navigateTo('login')}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ 
        padding: isMobile ? '2rem 1rem' : '4rem 2rem', 
        textAlign: 'center', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ 
          fontSize: isMobile ? '2rem' : '3rem', 
          marginBottom: '1rem', 
          fontWeight: 'bold',
          lineHeight: '1.2'
        }}>
          AI Legal Assistant
        </h1>
        <p style={{ 
          fontSize: isMobile ? '1rem' : '1.25rem', 
          marginBottom: '2rem', 
          opacity: 0.9,
          lineHeight: '1.6'
        }}>
          Get smarter legal responses with document analysis and AI-powered insights. 
          Upload your files and get instant legal guidance.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => navigateTo('login')}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              minWidth: isMobile ? '200px' : 'auto'
            }}
          >
            Start Free Trial
          </button>
          <button 
            onClick={() => setShowWelcomeModal(true)}
            style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              minWidth: isMobile ? '200px' : 'auto'
            }}
          >
            Sign In
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section style={{ 
        padding: '2rem', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📄 Document Analysis</h3>
            <p style={{ margin: 0, lineHeight: '1.5' }}>Upload legal documents and get instant AI-powered analysis and insights.</p>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💬 Smart Chat</h3>
            <p style={{ margin: 0, lineHeight: '1.5' }}>Ask legal questions and get intelligent responses from our AI assistant.</p>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🔒 Secure & Private</h3>
            <p style={{ margin: 0, lineHeight: '1.5' }}>Your documents and conversations are encrypted and completely confidential.</p>
          </div>
        </div>
      </section>
    </div>
  );

  // LoginPage Component - Exact Figma Design
  const LoginPage = () => (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        background: 'white', 
        padding: isMobile ? '1.5rem' : '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px' 
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>
            Eezlegal
          </h1>
          <h2 style={{ 
            fontSize: '1.25rem', 
            color: '#374151', 
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>
            Login or sign up
          </h2>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.875rem',
            margin: 0,
            lineHeight: '1.4'
          }}>
            Get smarter responses by uploading and chatting with your files
          </p>
        </div>

        {/* Social Login Buttons */}
        <div style={{ marginBottom: '1.5rem' }}>
          {[
            { icon: '🔍', text: 'Continue with Google' },
            { icon: '⊞', text: 'Continue with Microsoft' },
            { icon: '🍎', text: 'Continue with Apple' },
            { icon: '📞', text: 'Continue with phone' }
          ].map((provider, index) => (
            <button
              key={index}
              onClick={handleLogin}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                color: '#374151',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.target.style.background = '#f9fafb'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              <span style={{ marginRight: '0.5rem' }}>{provider.icon}</span>
              {provider.text}
            </button>
          ))}
        </div>

        {/* OR Divider */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          <span style={{ padding: '0 1rem', color: '#6b7280', fontSize: '0.875rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #3b82f6',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '1rem',
            fontFamily: 'inherit'
          }}
        >
          Continue
        </button>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => navigateTo('home')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#3b82f6', 
              cursor: 'pointer', 
              fontSize: '0.875rem',
              fontFamily: 'inherit'
            }}
          >
            ← Back to Home
          </button>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.75rem', 
            marginTop: '1rem',
            margin: '1rem 0 0 0'
          }}>
            Learn more about EezLegal AI Legal Assistant
          </p>
        </div>
      </div>
    </div>
  );

  // Dashboard Component - Full Chat Interface
  const Dashboard = () => {
    const [messages, setMessages] = useState([
      { id: 1, text: "Hello! I'm your AI legal assistant. How can I help you today?", sender: 'ai', timestamp: new Date() }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const sendMessage = () => {
      if (!inputMessage.trim()) return;

      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages([...messages, newMessage]);
      setInputMessage('');
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "I understand your question. Based on the legal context you've provided, here are some key considerations...",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    };

    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        background: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <header style={{ 
          background: 'white', 
          padding: '1rem 2rem', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  marginRight: '1rem'
                }}
              >
                ☰
              </button>
            )}
            <h1 style={{ 
              fontSize: isMobile ? '1.25rem' : '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginRight: '2rem',
              margin: '0 2rem 0 0'
            }}>
              Eezlegal
            </h1>
            {!isMobile && (
              <span style={{ color: '#6b7280' }}>AI Legal Assistant</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'inherit'
            }}
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          {(sidebarOpen || !isMobile) && (
            <div style={{ 
              width: isMobile ? '250px' : '300px', 
              background: 'white', 
              borderRight: '1px solid #e5e7eb', 
              padding: '1rem',
              position: isMobile ? 'absolute' : 'relative',
              height: isMobile ? '100%' : 'auto',
              zIndex: isMobile ? 1000 : 'auto',
              boxShadow: isMobile ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'
            }}>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '1rem', 
                color: '#374151',
                margin: '0 0 1rem 0'
              }}>
                Quick Actions
              </h3>
              
              <button style={{
                width: '100%',
                padding: '0.75rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit'
              }}>
                📄 Upload Document
              </button>
              
              <button style={{
                width: '100%',
                padding: '0.75rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit'
              }}>
                💬 New Chat
              </button>

              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem', 
                  color: '#6b7280',
                  margin: '0 0 0.5rem 0'
                }}>
                  Recent Chats
                </h4>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>No recent chats</div>
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            marginLeft: (isMobile && sidebarOpen) ? '250px' : '0'
          }}>
            {/* Messages */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      background: message.sender === 'user' ? '#3b82f6' : 'white',
                      color: message.sender === 'user' ? 'white' : '#374151',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.4' }}>
                      {message.text}
                    </p>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      opacity: 0.7, 
                      marginTop: '0.25rem',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    background: 'white',
                    color: '#6b7280',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    fontSize: '0.875rem'
                  }}>
                    AI is typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div style={{ 
              padding: '1rem', 
              background: 'white', 
              borderTop: '1px solid #e5e7eb' 
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask a legal question..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    fontFamily: 'inherit'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Welcome Back Modal
  const WelcomeModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem', 
          color: '#1f2937',
          margin: '0 0 1rem 0'
        }}>
          Welcome Back!
        </h2>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          margin: '0 0 2rem 0',
          lineHeight: '1.5'
        }}>
          Continue where you left off with your AI legal assistant.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <button
            onClick={handleLogin}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'inherit'
            }}
          >
            Log In
          </button>
          <button
            onClick={() => navigateTo('login')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'inherit'
            }}
          >
            Sign up for free
          </button>
        </div>
        <button
          onClick={() => setShowWelcomeModal(false)}
          style={{
            marginTop: '1rem',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'inherit'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Render current page
  const renderCurrentPage = () => {
    if (isLoggedIn && currentPage === 'dashboard') {
      return <Dashboard />;
    }
    
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'dashboard':
        return isLoggedIn ? <Dashboard /> : <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
      {showWelcomeModal && <WelcomeModal />}
    </div>
  );
};

export default EezLegalApp;
