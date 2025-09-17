// API Configuration
const API_CONFIG = {
  // Update this URL to your Railway backend URL after deployment
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.railway.app' 
    : 'http://localhost:5000',
  
  ENDPOINTS: {
    CHAT: '/api/chat',
    AUTH: '/api/auth',
    LOGIN: '/login',
    SIGNUP: '/signup'
  }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
  return API_CONFIG.BASE_URL + endpoint;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, getApiUrl };
}

