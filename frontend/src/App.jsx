import React, { useState, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Handle sending messages
  const handleSendMessage = () => {
    const messageText = inputRef.current?.value?.trim();
    console.log('Send button clicked!');
    console.log('handleSendMessage called');
    console.log('Message text:', messageText);

    if (!messageText) {
      console.log('No message text, returning');
      return;
    }

    console.log('Sending message:', messageText);

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Clear input
    if (inputRef.current) {
      inputRef.current.value = '';
      console.log('Input cleared');
    }

    // Show loading indicator
    setIsLoading(true);

    // Generate AI response after delay
    setTimeout(() => {
      console.log('Generating AI response...');
      const aiResponse = {
        id: Date.now() + 1,
        text: `Thank you for your legal question: "${messageText}"\n\nI understand you need legal assistance. To provide you with the most accurate guidance, could you please provide more specific details about your situation?\n\nFor example:\n• What jurisdiction or location does this concern?\n• Are there any urgent deadlines?\n• What specific outcome are you seeking?\n\nThis information will help me provide more targeted legal guidance for your specific situation.`,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);

    // DO NOT auto-login - users must manually authenticate
    console.log('Message sent - user must login manually to continue');
  };

  // Enhanced keyboard handler - supports both Enter and Cmd/Ctrl+Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter key pressed - sending message');
      handleSendMessage();
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      console.log('Keyboard shortcut triggered');
      handleSendMessage();
    }
  };

  // OAuth login handler
  const handleOAuthLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setMessages([]);
  };

  // Check if send button should be enabled
  const isSendEnabled = inputRef.current?.value?.trim().length > 0;

  // Render logged-in dashboard view
  if (isLoggedIn) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e5e5e5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#000',
              borderRadius: '4px'
            }} />
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Eezlegal</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {/* Chat Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          padding: '2rem'
        }}>
          {messages.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <h2 style={{ marginBottom: '2rem', color: '#333' }}>How can we help?</h2>
            </div>
          ) : (
            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '2rem'
            }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: message.sender === 'user' ? '#f0f0f0' : '#fff',
                    borderRadius: '8px',
                    border: message.sender === 'ai' ? '1px solid #e5e5e5' : 'none'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {message.sender === 'user' ? 'You' : 'EezLegal AI'}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ fontWeight: 'bold' }}>EezLegal AI</div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.2rem',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      animation: 'pulse 1.5s infinite',
                      fontSize: '1.2rem'
                    }}>•</span>
                    <span style={{ 
                      animation: 'pulse 1.5s infinite 0.5s',
                      fontSize: '1.2rem'
                    }}>•</span>
                    <span style={{ 
                      animation: 'pulse 1.5s infinite 1s',
                      fontSize: '1.2rem'
                    }}>•</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Message Input */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8f8f8',
              borderRadius: '25px',
              padding: '0.75rem 1.5rem',
              border: '2px solid #e5e5e5',
              maxWidth: '700px',
              margin: '0 auto',
              width: '100%'
            }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '1rem',
                  minHeight: '1.5rem'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                style={{
                  marginLeft: '1rem',
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isSendEnabled && !isLoading ? '#000' : '#ccc',
                  color: 'white',
                  cursor: isSendEnabled && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
            <div style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#666'
                }}
              >
                📎 Attach
              </button>
            </div>
          </div>
        </div>

        {/* CSS for loading animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Render homepage for non-logged-in users
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#000',
            borderRadius: '4px'
          }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Eezlegal</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#000',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          Eezlegal
        </h1>

        {/* Composer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '900px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8f8f8',
            borderRadius: '50px',
            padding: '1rem 2rem',
            border: '2px solid #e5e5e5',
            width: '100%'
          }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Tell us your legal problem..."
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '1.1rem',
                minHeight: '2rem'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              style={{
                marginLeft: '1rem',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: isSendEnabled && !isLoading ? '#000' : '#ccc',
                color: 'white',
                cursor: isSendEnabled && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

          <div style={{ textAlign: 'left' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#666'
              }}
            >
              📎 Attach
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Auth Modal - Exact Figma Design */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '3rem',
            width: '90%',
            maxWidth: '500px',
            position: 'relative'
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>

            {/* Modal content matching Figma exactly */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#000'
              }}>
                Login or sign up
              </h2>
              
              <p style={{
                color: '#666',
                marginBottom: '2rem',
                fontSize: '0.95rem'
              }}>
                You'll get smarter responses and can upload files, images, and more.
              </p>

              {/* OAuth Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                {/* Google */}
                <button
                  onClick={() => handleOAuthLogin('Google')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '25px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    width: '100%'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Microsoft */}
                <button
                  onClick={() => handleOAuthLogin('Microsoft')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '25px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    width: '100%'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M0 0h11v11H0z"/>
                    <path fill="#00A4EF" d="M13 0h11v11H13z"/>
                    <path fill="#7FBA00" d="M0 13h11v11H0z"/>
                    <path fill="#FFB900" d="M13 13h11v11H13z"/>
                  </svg>
                  Continue with Microsoft
                </button>

                {/* Apple */}
                <button
                  onClick={() => handleOAuthLogin('Apple')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '25px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    width: '100%'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Continue with Apple
                </button>

                {/* Phone */}
                <button
                  onClick={() => handleOAuthLogin('Phone')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '25px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    width: '100%'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  Continue with phone
                </button>
              </div>

              {/* OR divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '1.5rem 0',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
                <span style={{ padding: '0 1rem' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
              </div>

              {/* Email input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="email"
                  placeholder="Email address"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '25px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Continue button */}
              <button
                onClick={() => handleOAuthLogin('Email')}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginBottom: '2rem'
                }}
              >
                Continue
              </button>

              {/* Terms and Privacy */}
              <div style={{
                fontSize: '0.8rem',
                color: '#666',
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Terms of Use</a>
                <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
