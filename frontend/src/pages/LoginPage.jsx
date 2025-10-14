import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    const result = await login(`user@${provider.toLowerCase()}.com`, provider);
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleEmailLogin = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    setLoading(true);
    const result = await login(email, 'email');
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleWelcomeBack = () => {
    setShowWelcomeModal(true);
  };

  // Welcome Back Modal Component
  const WelcomeModal = () => (
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
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#000000',
          marginBottom: '16px'
        }}>
          Welcome Back
        </h2>
        
        <p style={{
          fontSize: '16px',
          color: '#666666',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          Log in or sign up to get smarter responses, upload files and images, and more.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <button 
            onClick={() => handleSocialLogin('existing')}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          
          <button 
            onClick={() => handleSocialLogin('new')}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: 'transparent',
              color: '#000000',
              border: '1px solid #e0e0e0',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
              opacity: loading ? 0.7 : 1
            }}
          >
            Sign up for free
          </button>
        </div>

        <button 
          onClick={() => setShowWelcomeModal(false)}
          style={{
            fontSize: '14px',
            color: '#666666',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Stay logged out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        padding: '20px',
        position: 'relative'
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
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Eezlegal
          </Link>
        </div>

        {/* Welcome Back Button */}
        <button
          onClick={handleWelcomeBack}
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
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
          Welcome Back
        </button>

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
            <button 
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
              style={{
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
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#f8f9fa')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#ffffff')}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>🔍</span>
              Continue with Google
            </button>

            {/* Microsoft Button */}
            <button 
              onClick={() => handleSocialLogin('Microsoft')}
              disabled={loading}
              style={{
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
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#f8f9fa')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#ffffff')}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>⊞</span>
              Continue with Microsoft
            </button>

            {/* Apple Button */}
            <button 
              onClick={() => handleSocialLogin('Apple')}
              disabled={loading}
              style={{
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
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#f8f9fa')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#ffffff')}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>🍎</span>
              Continue with Apple
            </button>

            {/* Phone Button */}
            <button 
              onClick={() => handleSocialLogin('Phone')}
              disabled={loading}
              style={{
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
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#f8f9fa')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#ffffff')}
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
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '1px solid #4285f4',
                borderRadius: '50px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                opacity: loading ? 0.7 : 1
              }}
            />
          </div>

          {/* Continue Button */}
          <button 
            onClick={handleEmailLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#333333')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#000000')}
          >
            {loading && <div className="spinner" />}
            {loading ? 'Continuing...' : 'Continue'}
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

        {/* Mobile Responsive Styles */}
        <style jsx>{`
          @media (max-width: 768px) {
            .container {
              padding: 16px;
            }
            
            h1 {
              font-size: 28px !important;
            }
            
            .header-logo {
              top: 20px !important;
              left: 20px !important;
              font-size: 20px !important;
            }
            
            .welcome-back-btn {
              top: 20px !important;
              right: 20px !important;
              font-size: 12px !important;
              padding: 6px 12px !important;
            }
          }
        `}</style>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && <WelcomeModal />}
    </>
  );
};

export default LoginPage;
