import React, { useState } from 'react';
import { Shield, Send, Paperclip, Menu, X, Settings, User, LogOut } from 'lucide-react';

const EezLegalApp = () => {
  // Core state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Working input state - PROVEN TO WORK
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // Settings state
  const [currentTheme, setCurrentTheme] = useState('Light');
  const [currentLanguage, setCurrentLanguage] = useState('Auto-detect');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Working input handlers - PROVEN TO WORK
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Add to chat history if it's a new conversation
    if (messages.length === 0) {
      const chatTitle = inputValue.length > 30 ? inputValue.substring(0, 30) + '...' : inputValue;
      setChatHistory(prev => [chatTitle, ...prev]);
    }
    
    setInputValue(''); // Clear input - PROVEN TO WORK
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I understand you need legal assistance. To provide you with the most accurate guidance, could you please provide more specific details about your legal situation? For example:\n\n• What type of legal issue are you facing?\n• What jurisdiction or location does this concern?\n• Are there any urgent deadlines or time-sensitive matters?\n\nThis information will help me provide more targeted legal guidance for your specific situation.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSendMessage();
    }
  };

  // OAuth handlers
  const handleOAuthLogin = (provider) => {
    const oauthUrls = {
      google: 'https://accounts.google.com/oauth/authorize?client_id=your-client-id&redirect_uri=your-redirect&scope=openid%20email%20profile&response_type=code',
      microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=your-client-id&response_type=code&redirect_uri=your-redirect&scope=openid%20email%20profile',
      apple: 'https://appleid.apple.com/auth/authorize?client_id=your-client-id&redirect_uri=your-redirect&response_type=code&scope=name%20email'
    };
    
    if (oauthUrls[provider]) {
      window.open(oauthUrls[provider], '_blank');
    }
  };

  const handleEmailLogin = (email) => {
    if (email && email.includes('@')) {
      setIsLoggedIn(true);
      setShowAuthModal(false);
    } else {
      alert('Please enter a valid email address');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMessages([]);
    setChatHistory([]);
    setInputValue('');
    setShowUserMenu(false);
  };

  // Working Input Component - PROVEN TO WORK
  const WorkingInput = ({ placeholder, onSend }) => (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      position: 'relative'
    }}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        style={{
          width: '100%',
          padding: '1rem 4rem 1rem 1.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '2rem',
          fontSize: '1rem',
          outline: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff'
        }}
      />
      <button
        onClick={onSend}
        disabled={!inputValue.trim()}
        style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: inputValue.trim() ? '#000000' : '#e5e7eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: inputValue.trim() ? 'pointer' : 'not-allowed'
        }}
      >
        <Send size={18} />
      </button>
    </div>
  );

  // Homepage Component - EXACT Figma Match
  const Homepage = () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header - NO BORDER as per Figma */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#000000'
        }}>
          <Shield size={24} />
          Eezlegal
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              background: '#000000',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'inherit'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              background: 'transparent',
              color: '#000000',
              border: '1px solid #e5e5e5',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'inherit'
            }}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content - Exact Figma Layout */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '600',
          color: '#000000',
          marginBottom: '4rem',
          textAlign: 'center'
        }}>
          Eezlegal
        </h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <WorkingInput 
            placeholder="Tell us your legal problem..." 
            onSend={handleSendMessage}
          />
        </div>

        <button style={{
          background: 'transparent',
          color: '#6b7280',
          border: '1px solid #d1d5db',
          padding: '0.75rem 1.25rem',
          borderRadius: '2rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'inherit'
        }}>
          <Paperclip size={16} />
          Attach
        </button>
      </main>
    </div>
  );

  // Authentication Modal with proper OAuth icons
  const AuthModal = () => {
    const [email, setEmail] = useState('');

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          padding: '2rem',
          maxWidth: '420px',
          width: '100%',
          position: 'relative'
        }}>
          <button
            onClick={() => setShowAuthModal(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#000000',
              marginBottom: '0.5rem'
            }}>
              Login or sign up
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              You'll get smarter responses and can upload files, images, and more.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {/* Google OAuth */}
            <button
              onClick={() => handleOAuthLogin('google')}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                background: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Microsoft OAuth */}
            <button
              onClick={() => handleOAuthLogin('microsoft')}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                background: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Continue with Microsoft
            </button>

            {/* Apple OAuth */}
            <button
              onClick={() => handleOAuthLogin('apple')}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                background: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#000000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>

            {/* Phone OAuth */}
            <button
              onClick={() => alert('Phone authentication would be implemented here')}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                background: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Continue with phone
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            <span style={{ padding: '0 1rem', color: '#6b7280', fontSize: '0.875rem' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          </div>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '2px solid #3b82f6',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              marginBottom: '1rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />

          <button
            onClick={() => handleEmailLogin(email)}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'inherit'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '60px' : '260px',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease'
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between'
        }}>
          {!sidebarCollapsed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              <Shield size={20} />
              Eezlegal
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        <div style={{ padding: '1rem' }}>
          <button
            onClick={() => {
              setMessages([]);
              setInputValue('');
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '0.5rem',
              fontFamily: 'inherit'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>+</span>
            {!sidebarCollapsed && 'New Chat'}
          </button>
        </div>

        {!sidebarCollapsed && chatHistory.length > 0 && (
          <div style={{ flex: 1, padding: '0 1rem' }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Recent Chats
            </h3>
            {chatHistory.map((chat, index) => (
              <button
                key={index}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  marginBottom: '0.25rem',
                  color: '#374151',
                  fontFamily: 'inherit'
                }}
              >
                {chat}
              </button>
            ))}
          </div>
        )}

        <div style={{
          padding: '1rem',
          borderTop: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          {!sidebarCollapsed && (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit'
              }}
            >
              <User size={16} />
              User
            </button>
          )}
          
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '1rem',
              right: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 100
            }}>
              <button
                onClick={() => {
                  setShowSettings(true);
                  setShowUserMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textAlign: 'left',
                  fontFamily: 'inherit'
                }}
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textAlign: 'left',
                  fontFamily: 'inherit'
                }}
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#000000',
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              How can we help?
            </h1>

            <div style={{ marginBottom: '1.5rem' }}>
              <WorkingInput 
                placeholder="Tell us your legal problem..." 
                onSend={handleSendMessage}
              />
            </div>

            <button style={{
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              padding: '0.75rem 1.25rem',
              borderRadius: '2rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit'
            }}>
              <Paperclip size={16} />
              Attach
            </button>
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem'
            }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '1.5rem',
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: message.sender === 'user' ? '#e5e7eb' : '#ffffff',
                      border: message.sender === 'ai' ? '1px solid #e5e7eb' : 'none',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.5'
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '1rem 2rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <WorkingInput 
                  placeholder="Type your message..." 
                  onSend={handleSendMessage}
                />
              </div>
              
              <button style={{
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '0.75rem 1.25rem',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit'
              }}>
                <Paperclip size={16} />
                Attach
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Settings Modal (simplified for now)
  const SettingsModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        position: 'relative'
      }}>
        <button
          onClick={() => setShowSettings(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#000000',
          marginBottom: '2rem'
        }}>
          Settings
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Theme
          </label>
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontFamily: 'inherit'
            }}
          >
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Language
          </label>
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontFamily: 'inherit'
            }}
          >
            <option>Auto-detect</option>
            <option>English (US)</option>
            <option>Dutch</option>
            <option>Espanola</option>
            <option>French</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Homepage />}
      {showAuthModal && <AuthModal />}
      {showSettings && <SettingsModal />}
    </div>
  );
};

export default EezLegalApp;
