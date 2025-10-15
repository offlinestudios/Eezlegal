import React, { useState } from 'react';
import { Shield, Send, Paperclip, Menu, X, Settings, User, LogOut } from 'lucide-react';
import { Textarea } from './components/ui/textarea';
import ModalBase from './components/modals/ModalBase';
import SafeChatScaffold from './layout/SafeChatScaffold';

const EezLegalApp = () => {
  // ISOLATED INPUT STATE - COMPLETELY SEPARATE FROM OTHER FEATURES
  const [inputText, setInputText] = useState('');
  
  // Core application state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // Settings state
  const [currentTheme, setCurrentTheme] = useState('Light');
  const [currentLanguage, setCurrentLanguage] = useState('Auto-detect');

  // FIXED INPUT HANDLERS - DIRECT AND SIMPLE
  const handleInputChange = (e) => {
    console.log('Input change:', e.target.value); // Debug log
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Add to chat history if it's a new conversation
    if (messages.length === 0) {
      const chatTitle = inputText.length > 30 ? inputText.substring(0, 30) + '...' : inputText;
      setChatHistory(prev => [chatTitle, ...prev]);
    }
    
    setInputText(''); // Clear input
    
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

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // OAuth handlers - Updated to point to backend
  const handleOAuthLogin = (provider) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const oauthUrls = {
      google: `${backendUrl}/auth/google`,
      microsoft: `${backendUrl}/auth/microsoft`,
      apple: `${backendUrl}/auth/apple`
    };
    
    if (oauthUrls[provider]) {
      window.location.href = oauthUrls[provider];
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
    setInputText('');
    setShowUserMenu(false);
  };

  // FIXED COMPOSER COMPONENT - USING NEW TEXTAREA WITH GUARANTEED HEIGHT
  const ComposerInput = ({ placeholder }) => (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '700px'
    }}>
      <Textarea
        placeholder={placeholder}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{
          paddingRight: '4rem', // Space for send button
          borderRadius: '2rem',
          resize: 'none',
          border: '2px solid #e5e7eb',
          backgroundColor: '#ffffff'
        }}
      />
      <button
        onClick={handleSendMessage}
        disabled={!inputText.trim()}
        style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: inputText.trim() ? '#000000' : '#e5e7eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: inputText.trim() ? 'pointer' : 'not-allowed'
        }}
      >
        <Send size={20} />
      </button>
    </div>
  );

  // Homepage Component
  const Homepage = () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header - Clean, no border */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        zIndex: 10
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

      {/* Main Content - USING SAFE LAYOUT SCAFFOLD PATTERN */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        maxWidth: '900px',
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

        {/* COMPOSER FOOTER - FLEX-NONE TO PREVENT SQUEEZING */}
        <footer style={{
          flex: '0 0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '1rem',
          backgroundColor: '#ffffff'
        }}>
          <ComposerInput placeholder="Tell us your legal problem..." />
          
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
        </footer>
      </main>
    </div>
  );

  // Authentication Modal - USING NEW MODAL BASE
  const AuthModal = () => {
    const [email, setEmail] = useState('');

    return (
      <ModalBase open={showAuthModal} onClose={() => setShowAuthModal(false)}>
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
      </ModalBase>
    );
  };

  // Dashboard Component - USING SAFE CHAT SCAFFOLD
  const Dashboard = () => {
    const header = (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
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
        </div>
        
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <User size={16} />
            User
          </button>
          
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 100,
              minWidth: '150px'
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
    );

    const messagesContent = (
      <div style={{ padding: '2rem' }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '400px'
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
          </div>
        ) : (
          <div>
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
        )}
      </div>
    );

    const composerContent = (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <ComposerInput placeholder="Type your message..." />
        
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
          fontFamily: 'inherit',
          alignSelf: 'flex-start'
        }}>
          <Paperclip size={16} />
          Attach
        </button>
      </div>
    );

    return (
      <SafeChatScaffold
        header={header}
        messages={messagesContent}
        composer={composerContent}
      />
    );
  };

  // Settings Modal - USING NEW MODAL BASE
  const SettingsModal = () => (
    <ModalBase open={showSettings} onClose={() => setShowSettings(false)}>
      <div style={{ display: 'flex', minHeight: '400px' }}>
        {/* Settings Sidebar */}
        <div style={{
          width: '200px',
          borderRight: '1px solid #e5e7eb',
          paddingRight: '2rem',
          marginRight: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#000000',
            marginBottom: '2rem'
          }}>
            Settings
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <button style={{
              padding: '0.75rem',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left',
              fontFamily: 'inherit'
            }}>
              <Settings size={16} />
              General
            </button>
            <button style={{
              padding: '0.75rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left',
              fontFamily: 'inherit',
              color: '#6b7280'
            }}>
              <User size={16} />
              Account
            </button>
            <button style={{
              padding: '0.75rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left',
              fontFamily: 'inherit',
              color: '#6b7280'
            }}>
              <Shield size={16} />
              Data Controls
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#000000',
            marginBottom: '2rem'
          }}>
            General
          </h3>

          <div style={{ marginBottom: '2rem' }}>
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
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
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
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
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
    </ModalBase>
  );

  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Homepage />}
      {/* MODALS USING NEW MODAL BASE - PROPER UNMOUNTING */}
      <AuthModal />
      <SettingsModal />
    </div>
  );
};

export default EezLegalApp;
