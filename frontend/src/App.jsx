import React, { useState, useRef } from 'react';
import { Shield, Send, Paperclip } from 'lucide-react';

const EezLegalApp = () => {
  const inputRef = useRef(null);
  
  // Simple state management
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // FIXED MESSAGE SENDING FUNCTION
  const handleSendMessage = () => {
    console.log('=== SEND MESSAGE FUNCTION CALLED ===');
    
    // Get the input value
    const messageText = inputRef.current?.value?.trim();
    console.log('Input value:', messageText);
    
    if (!messageText) {
      console.log('No message text found, aborting');
      return;
    }

    console.log('Creating new message...');
    
    // Create user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    console.log('User message created:', userMessage);

    // Add user message to state
    setMessages(prevMessages => {
      console.log('Previous messages:', prevMessages);
      const newMessages = [...prevMessages, userMessage];
      console.log('New messages array:', newMessages);
      return newMessages;
    });

    // Clear input
    if (inputRef.current) {
      inputRef.current.value = '';
      console.log('Input cleared');
    }

    // Generate AI response after a short delay
    console.log('Setting timeout for AI response...');
    setTimeout(() => {
      console.log('Generating AI response...');
      
      const aiResponse = {
        id: Date.now() + 1,
        text: `Thank you for your legal question: "${messageText}"\n\nI understand you need legal assistance. To provide you with the most accurate guidance, could you please provide more specific details about your situation?\n\nFor example:\n• What jurisdiction or location does this concern?\n• Are there any urgent deadlines?\n• What specific outcome are you seeking?\n\nThis information will help me provide more targeted legal guidance for your specific situation.`,
        sender: 'ai',
        timestamp: new Date()
      };

      console.log('AI response created:', aiResponse);

      setMessages(prevMessages => {
        console.log('Adding AI response to messages...');
        const updatedMessages = [...prevMessages, aiResponse];
        console.log('Final messages array:', updatedMessages);
        return updatedMessages;
      });
    }, 1000);

    // Note: User must be logged in to see responses in dashboard
    // Messages are sent but responses only visible after login
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

  // Simple Composer Component
  const SimpleComposer = ({ placeholder }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      gap: '1rem'
    }}>
      {/* Input Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '50px',
        padding: '12px 60px 12px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        minHeight: '60px'
      }}>
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            backgroundColor: 'transparent',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
        />
        
        {/* Send Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('=== SEND BUTTON CLICKED ===');
            handleSendMessage();
          }}
          type="button"
          style={{
            position: 'absolute',
            right: '8px',
            background: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Send size={20} />
        </button>
      </div>
      
      {/* Attach Button */}
      <button 
        onClick={() => console.log('Attach button clicked')}
        type="button"
        style={{
          background: 'transparent',
          color: '#6b7280',
          border: '1px solid #d1d5db',
          padding: '0.75rem 1.5rem',
          borderRadius: '50px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
          alignSelf: 'flex-start'
        }}
      >
        <Paperclip size={16} />
        Attach
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
      {/* Header */}
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

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '600',
          color: '#000000',
          marginBottom: '4rem',
          textAlign: 'center'
        }}>
          Eezlegal
        </h1>

        <SimpleComposer placeholder="Tell us your legal problem..." />
      </main>
    </div>
  );

  // Chat Dashboard Component
  const ChatDashboard = () => (
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
        borderBottom: '1px solid #e5e7eb'
      }}>
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
        
        <button
          onClick={() => {
            setIsLoggedIn(false);
            setMessages([]);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          Logout
        </button>
      </header>

      {/* Chat Messages */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        {messages.length === 0 ? (
          <>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#000000',
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              How can we help?
            </h1>
            <SimpleComposer placeholder="Type your message..." />
          </>
        ) : (
          <>
            {/* Messages Display */}
            <div style={{ flex: 1, marginBottom: '2rem' }}>
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
                      backgroundColor: message.sender === 'user' ? '#e5e7eb' : '#f9fafb',
                      border: message.sender === 'ai' ? '1px solid #e5e7eb' : 'none',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.5',
                      fontSize: '0.95rem'
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Composer at bottom */}
            <SimpleComposer placeholder="Type your message..." />
          </>
        )}
      </main>
    </div>
  );

  // Simple Auth Modal
  const AuthModal = () => {
    if (!showAuthModal) return null;

    return (
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
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '90%',
          position: 'relative'
        }}>
          <button
            onClick={() => setShowAuthModal(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#000000',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Login or sign up
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                fontSize: '0.875rem',
                fontFamily: 'inherit'
              }}
            >
              Continue with Google
            </button>
            
            <button
              onClick={() => handleOAuthLogin('email')}
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
              Continue with Email
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Debug info
  console.log('Current state:', { 
    isLoggedIn, 
    messagesCount: messages.length, 
    showAuthModal 
  });

  return (
    <div>
      {isLoggedIn ? <ChatDashboard /> : <Homepage />}
      <AuthModal />
    </div>
  );
};

export default EezLegalApp;
