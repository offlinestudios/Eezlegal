import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#000000'
        }}>
          Eezlegal
        </div>
        <Link 
          to="/login"
          style={{
            padding: '12px 24px',
            backgroundColor: '#000000',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#333333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#000000'}
        >
          Get Started
        </Link>
      </header>

      {/* Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: '700',
            color: '#000000',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Your AI Legal Assistant
          </h1>
          
          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            color: '#666666',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}>
            Get smarter legal responses, upload documents, and receive professional legal assistance powered by AI.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/login"
              style={{
                padding: '16px 32px',
                backgroundColor: '#000000',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                minWidth: '160px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#333333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#000000'}
            >
              Start Free Trial
            </Link>
            
            <button style={{
              padding: '16px 32px',
              backgroundColor: 'transparent',
              color: '#000000',
              border: '2px solid #000000',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '160px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#000000';
              e.target.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#000000';
            }}
            >
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section style={{
        padding: '80px 40px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '600',
            color: '#000000',
            marginBottom: '48px'
          }}>
            Why Choose EezLegal?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginTop: '48px'
          }}>
            {/* Feature 1 */}
            <div style={{
              padding: '32px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>🤖</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#000000',
                marginBottom: '16px'
              }}>
                AI-Powered Responses
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#666666',
                lineHeight: '1.6'
              }}>
                Get intelligent legal advice powered by advanced AI technology trained on legal documents and case law.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              padding: '32px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>📄</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#000000',
                marginBottom: '16px'
              }}>
                Document Analysis
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#666666',
                lineHeight: '1.6'
              }}>
                Upload contracts, legal documents, and files for instant analysis and professional insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              padding: '32px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>⚡</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#000000',
                marginBottom: '16px'
              }}>
                Instant Support
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#666666',
                lineHeight: '1.6'
              }}>
                Get immediate legal guidance 24/7 without waiting for appointments or consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        backgroundColor: '#000000',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Eezlegal
        </div>
        <p style={{
          fontSize: '14px',
          color: '#cccccc'
        }}>
          © 2024 EezLegal AI Legal Assistant. Professional Legal Help.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
