// API Configuration
const API_CONFIG = {
  // Update this URL to your Railway backend URL after deployment
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.railway.app' 
    : 'http://localhost:8000',
  
  ENDPOINTS: {
    CHAT: '/api/chat',
    AUTH: '/api/auth',
    AUTH_VERIFY: '/api/auth/verify',
    GOOGLE_AUTH: '/auth/google',
    LOGIN: '/login',
    SIGNUP: '/signup'
  }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
  return API_CONFIG.BASE_URL + endpoint;
}

// OAuth helper functions
function initiateGoogleAuth() {
  window.location.href = getApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_AUTH);
}

// Token management
function setAuthToken(token) {
  localStorage.setItem('auth_token', token);
}

function getAuthToken() {
  return localStorage.getItem('auth_token');
}

function removeAuthToken() {
  localStorage.removeItem('auth_token');
}

// Check if user is authenticated
async function isAuthenticated() {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_VERIFY), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return false;
  }
}

// Handle OAuth callback (extract token from URL)
function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    setAuthToken(token);
    // Redirect to dashboard or main app
    window.location.href = '/';
    return true;
  }
  return false;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    API_CONFIG, 
    getApiUrl, 
    initiateGoogleAuth,
    setAuthToken,
    getAuthToken,
    removeAuthToken,
    isAuthenticated,
    handleOAuthCallback
  };
}

