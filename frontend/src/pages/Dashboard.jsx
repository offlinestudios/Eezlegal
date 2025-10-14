import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `Welcome to EezLegal, ${user?.name || 'User'}! I'm your AI legal assistant. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const responses = [
      "I understand your legal concern. Based on the information provided, here are some key points to consider...",
      "This is an interesting legal question. Let me break down the relevant legal principles for you...",
      "I can help you with that legal matter. Here's what you should know about your situation...",
      "Thank you for your question. From a legal perspective, there are several important factors to consider...",
      "I'd be happy to assist you with this legal issue. Let me provide you with some guidance..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileMessage = {
        id: Date.now(),
        type: 'user',
        content: `📎 Uploaded: ${file.name}`,
        timestamp: new Date(),
        isFile: true
      };
      setMessages(prev => [...prev, fileMessage]);
      
      // Simulate file analysis
      setTimeout(() => {
        const analysisResponse = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `I've analyzed your document "${file.name}". Here's what I found: This appears to be a legal document that requires careful review. I can help you understand the key terms and implications.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, analysisResponse]);
      }, 2000);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: window.innerWidth <= 768 ? (isMobileMenuOpen ? '280px' : '0') : '280px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: window.innerWidth <= 768 ? 'fixed' : 'relative',
        height: '100vh',
        zIndex: 1000
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#000000',
            marginBottom: '8px'
          }}>
            Eezlegal
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666666'
          }}>
            AI Legal Assistant
          </div>
        </div>

        {/* New Chat Button */}
        <div style={{ padding: '20px' }}>
          <button style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#333333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#000000'}
          onClick={() => setMessages([{
            id: 1,
            type: 'assistant',
            content: `Welcome to EezLegal, ${user?.name || 'User'}! I'm your AI legal assistant. How can I help you today?`,
            timestamp: new Date()
          }])}
          >
            + New Chat
          </button>
        </div>

        {/* Chat History */}
        <div style={{
          flex: 1,
          padding: '0 20px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#999999',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Recent Chats
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#333333'
          }}>
            Contract Review Discussion
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            marginBottom: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666666'
          }}>
            Employment Law Question
          </div>
        </div>

        {/* User Profile */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#000000',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              marginRight: '12px'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000'
              }}>
                {user?.name || 'User'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666666'
              }}>
                {user?.email}
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              color: '#666666',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.color = '#000000';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#666666';
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          {/* Mobile Menu Button */}
          {window.innerWidth <= 768 && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '12px'
              }}
            >
              ☰
            </button>
          )}
          
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#000000',
              margin: 0
            }}>
              Legal Assistant Chat
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              margin: 0
            }}>
              Ask me anything about legal matters
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#666666',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              📎 Upload
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              {message.type === 'assistant' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#000000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  🤖
                </div>
              )}
              
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: message.type === 'user' ? '#000000' : '#f8f9fa',
                color: message.type === 'user' ? '#ffffff' : '#000000',
                fontSize: '14px',
                lineHeight: '1.5',
                wordWrap: 'break-word'
              }}>
                <div>{message.content}</div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.7,
                  marginTop: '4px'
                }}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
              
              {message.type === 'user' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#4285f4',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#000000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '16px'
              }}>
                🤖
              </div>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: '#f8f9fa',
                color: '#666666',
                fontSize: '14px'
              }}>
                <div className="typing-indicator">
                  <span>●</span>
                  <span>●</span>
                  <span>●</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            maxWidth: '100%'
          }}>
            <div style={{
              flex: 1,
              position: 'relative'
            }}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me about legal matters, upload documents, or get legal advice..."
                style={{
                  width: '100%',
                  minHeight: '44px',
                  maxHeight: '120px',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '22px',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.4'
                }}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: inputMessage.trim() ? '#000000' : '#e0e0e0',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              ↑
            </button>
          </div>
          
          <div style={{
            fontSize: '12px',
            color: '#999999',
            textAlign: 'center',
            marginTop: '12px'
          }}>
            EezLegal can make mistakes. Consider checking important information.
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      />

      {/* Mobile Overlay */}
      {window.innerWidth <= 768 && isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Typing Animation Styles */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
        }
        
        .typing-indicator span {
          animation: typing 1.4s infinite;
          animation-fill-mode: both;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            opacity: 0.3;
          }
          30% {
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .messages-container {
            padding: 16px !important;
          }
          
          .input-area {
            padding: 16px !important;
          }
          
          .message-bubble {
            max-width: 85% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
