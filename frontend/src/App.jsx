import React, { useState } from 'react';
import { Shield, Send, Paperclip } from 'lucide-react';

const EezLegalApp = () => {
  // Simple state - no complex logic
  const [inputText, setInputText] = useState('');

  // Simple handlers - no interference
  const updateInput = (event) => {
    setInputText(event.target.value);
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      alert(`Message sent: ${inputText}`);
      setInputText('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputText.trim()) {
      sendMessage();
    }
  };

  return (
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
          <button style={{
            background: '#000000',
            color: '#ffffff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            fontFamily: 'inherit'
          }}>
            Login
          </button>
          <button style={{
            background: 'transparent',
            color: '#000000',
            border: '1px solid #e5e5e5',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            fontFamily: 'inherit'
          }}>
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
        maxWidth: '900px', // Increased for proper width
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

        {/* Composer - Proper Figma Width */}
        <div style={{
          width: '100%',
          maxWidth: '700px', // Proper Figma width
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Tell us your legal problem..."
            value={inputText}
            onChange={updateInput}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '1.25rem 4.5rem 1.25rem 1.75rem', // Proper padding
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
            onClick={sendMessage}
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
              width: '3rem', // Slightly larger
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

        {/* Debug Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#374151',
          maxWidth: '700px',
          width: '100%'
        }}>
          <strong>Debug:</strong> Input value: "{inputText}" (Length: {inputText.length})
          <br />
          <strong>Test:</strong> Try typing - each character should appear immediately
        </div>
      </main>
    </div>
  );
};

export default EezLegalApp;
