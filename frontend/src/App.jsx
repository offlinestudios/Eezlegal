import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        fontSize: '24px',
        fontWeight: '600',
        color: '#000000'
      }}>
        Eezlegal
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: '#000000',
          marginBottom: '16px',
          margin: '0 0 16px 0'
        }}>
          Login or sign up
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '16px',
          color: '#666666',
          marginBottom: '40px',
          lineHeight: '1.5'
        }}>
          You'll get smarter responses and can upload files, images, and more.
        </p>

        {/* Social Login Buttons */}
        <div style={{ marginBottom: '24px' }}>
          {/* Google Button */}
          <button style={{
            width: '100%',
            padding: '14px 20px',
            marginBottom: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '50px',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            fontWeight: '500',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <span style={{ marginRight: '12px', fontSize: '18px' }}>🔍</span>
            Continue with Google
          </button>

          {/* Microsoft Button */}
          <button style={{
            width: '100%',
            padding: '14px 20px',
            marginBottom: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '50px',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            fontWeight: '500',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <span style={{ marginRight: '12px', fontSize: '18px' }}>⊞</span>
            Continue with Microsoft
          </button>

          {/* Apple Button */}
          <button style={{
            width: '100%',
            padding: '14px 20px',
            marginBottom: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '50px',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            fontWeight: '500',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <span style={{ marginRight: '12px', fontSize: '18px' }}>🍎</span>
            Continue with Apple
          </button>

          {/* Phone Button */}
          <button style={{
            width: '100%',
            padding: '14px 20px',
            marginBottom: '24px',
            border: '1px solid #e0e0e0',
            borderRadius: '50px',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            fontWeight: '500',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <span style={{ marginRight: '12px', fontSize: '18px' }}>📞</span>
            Continue with phone
          </button>
        </div>

        {/* OR Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#e0e0e0'
          }}></div>
          <span style={{
            padding: '0 16px',
            fontSize: '14px',
            color: '#666666',
            fontWeight: '500'
          }}>
            OR
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#e0e0e0'
          }}></div>
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px',
              border: '1px solid #4285f4',
              borderRadius: '50px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#ffffff'
            }}
          />
        </div>

        {/* Continue Button */}
        <button style={{
          width: '100%',
          padding: '16px 20px',
          backgroundColor: '#000000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#333333'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#000000'}
        onClick={() => {
          if (email) {
            alert(`Welcome to EezLegal! Continuing with ${email}`);
          } else {
            alert('Please enter your email address');
          }
        }}
        >
          Continue
        </button>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        fontSize: '12px',
        color: '#999999',
        textAlign: 'center'
      }}>
        <span style={{
          backgroundColor: '#333333',
          color: '#ffffff',
          padding: '4px 8px',
          borderRadius: '4px',
          marginRight: '8px'
        }}>
          Learn more
        </span>
        EezLegal AI Legal Assistant - Professional Legal Help
      </div>
    </div>
  );
}

export default App;
