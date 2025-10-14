import React, { useState } from 'react';
import { Shield, Send, Paperclip, Menu, X, Settings, User, HelpCircle, LogOut } from 'lucide-react';

const EezLegalApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('Light');
  const [currentLanguage, setCurrentLanguage] = useState('Auto-detect');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Sample chat history
  const chatHistory = [
    'Contract Review Question',
    'Employer legal issue',
    'Lease Agreement help',
    'Business formation strategy'
  ];

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setShowWelcomeModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    setMessages([]);
    setActiveChat(null);
  };

  // Send message
  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I can definitely help. Tenant-landlord disputes in Toronto fall under the Residential Tenancies Act (RTA) and are overseen by the Landlord and Tenant Board (LTB). The best way forward depends on the exact issue.\n\nCould you tell me a bit more about the problem? For example:\n\n• Is it about repairs/maintenance (e.g. landlord not fixing something)?\n• Rent issues (increase, late payment, illegal charges, deposits, etc.)?\n• Eviction or pressure to leave?\n• Privacy/harassment(landlord entering without notice, disruptive behavior)?\n• Deposit/last month's rent problems?\n\nThat will let me break down your specific rights under Ontario law, what documentation you should gather, and the practical steps (from sending written notice → to filing with the LTB if needed).\n\nIf you'd like, I can also draft a clear message/letter/email to your landlord citing the law, so you come across firm and professional.\n\nWhat's the specific issue you're facing?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Homepage Component - Exact Figma Design
  const Homepage = () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid #f0f0f0'
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
        <div style={{ display: 'flex', gap: '1rem' }}>
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
              fontWeight: '500'
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
              fontWeight: '500'
            }}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content */}
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
        {/* Title */}
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '600',
          color: '#000000',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          Eezlegal
        </h1>

        {/* Composer Interface */}
        <div style={{
          width: '100%',
          maxWidth: '600px',
          marginBottom: '1rem'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Tell us your legal problem..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                width: '100%',
                padding: '1rem 3rem 1rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '1.5rem',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                position: 'absolute',
                right: '0.5rem',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Attach Button */}
        <button
          style={{
            background: 'transparent',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Paperclip size={16} />
          Attach
        </button>
      </main>
    </div>
  );

  // Authentication Modal
  const AuthModal = () => (
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
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '400px',
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

        {/* Social Login Buttons */}
        <div style={{ marginBottom: '1.5rem' }}>
          {[
            { text: 'Continue with Google' },
            { text: 'Continue with Microsoft' },
            { text: 'Continue with Apple' },
            { text: 'Continue with phone' }
          ].map((provider, index) => (
            <button
              key={index}
              onClick={handleLogin}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit'
              }}
            >
              {provider.text}
            </button>
          ))}
        </div>

        {/* OR Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          <span style={{ padding: '0 1rem', color: '#6b7280', fontSize: '0.875rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        </div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email address"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #3b82f6',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            marginBottom: '1rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />

        {/* Continue Button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
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

  // Dashboard Component - ChatGPT Style
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
        {/* Sidebar Header */}
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

        {/* New Chat Button */}
        <div style={{ padding: '1rem' }}>
          <button
            onClick={() => {
              setMessages([]);
              setActiveChat(null);
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
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>+</span>
            {!sidebarCollapsed && 'New Chat'}
          </button>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div style={{ padding: '0 1rem 1rem' }}>
            <input
              type="text"
              placeholder="Search chats"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* Recent Chats */}
        {!sidebarCollapsed && (
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
                onClick={() => setActiveChat(chat)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: activeChat === chat ? '#e5e7eb' : 'transparent',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  marginBottom: '0.25rem',
                  color: '#374151'
                }}
              >
                {chat}
              </button>
            ))}
          </div>
        )}

        {/* User Menu */}
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
                gap: '0.5rem'
              }}
            >
              <User size={16} />
              User6
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
                  textAlign: 'left'
                }}
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(true);
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
                  textAlign: 'left'
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
          // Empty State
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

            <div style={{
              width: '100%',
              maxWidth: '600px',
              marginBottom: '1rem'
            }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  placeholder="Tell us your legal problem..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  style={{
                    width: '100%',
                    padding: '1rem 3rem 1rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '1.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    background: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '2rem',
                    height: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            <button
              style={{
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Paperclip size={16} />
              Attach
            </button>
          </div>
        ) : (
          // Chat Messages
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

            {/* Chat Input */}
            <div style={{
              padding: '1rem 2rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  style={{
                    width: '100%',
                    padding: '1rem 3rem 1rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '1.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    background: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '2rem',
                    height: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
              
              <button
                style={{
                  background: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Paperclip size={16} />
                Attach
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Welcome Back Modal
  const WelcomeModal = () => (
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
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Welcome Back
        </h2>
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem',
          fontSize: '0.875rem'
        }}>
          Log in or sign up to get smarter responses, upload files and images, and more.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Log In
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Sign up for free
          </button>
          <button
            onClick={() => setShowWelcomeModal(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              padding: '0.5rem'
            }}
          >
            Stay logged out
          </button>
        </div>
      </div>
    </div>
  );

  // Logout Confirmation Modal
  const LogoutModal = () => (
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
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Are you sure you want to log out
        </h2>
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem',
          fontSize: '0.875rem'
        }}>
          Log out of Eezlegal as User6?
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Log out
          </button>
          <button
            onClick={() => setShowLogoutModal(false)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Settings Modal
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
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '600px',
        height: '400px',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Settings Sidebar */}
        <div style={{
          width: '200px',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e5e7eb',
          padding: '1rem'
        }}>
          <button
            onClick={() => setShowSettings(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
          
          <div style={{ marginTop: '2rem' }}>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '0.375rem',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Settings size={16} />
              General
            </div>
            <div style={{
              padding: '0.75rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280'
            }}>
              <User size={16} />
              Account
            </div>
            <div style={{
              padding: '0.75rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280'
            }}>
              <Shield size={16} />
              Data Controls
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div style={{
          flex: 1,
          padding: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '2rem'
          }}>
            General
          </h2>

          {/* Theme Setting */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Theme
            </label>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                style={{
                  width: '200px',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {currentTheme}
                <span>▼</span>
              </button>
              
              {showThemeDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 100
                }}>
                  {['System', 'Dark', 'Light'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        setCurrentTheme(theme);
                        setShowThemeDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {theme}
                      {currentTheme === theme && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Language Setting */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Language
            </label>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                style={{
                  width: '200px',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {currentLanguage}
                <span>▼</span>
              </button>
              
              {showLanguageDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 100
                }}>
                  {['Auto-detect', 'English (US)', 'Dutch', 'Espanola', 'French'].map((language) => (
                    <button
                      key={language}
                      onClick={() => {
                        setCurrentLanguage(language);
                        setShowLanguageDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {language}
                      {currentLanguage === language && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Homepage />}
      
      {showAuthModal && <AuthModal />}
      {showWelcomeModal && <WelcomeModal />}
      {showLogoutModal && <LogoutModal />}
      {showSettings && <SettingsModal />}
    </div>
  );
};

export default EezLegalApp;
