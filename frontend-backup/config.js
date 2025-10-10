// EezLegal Frontend Configuration - FIXED OAuth Implementation

// Backend API Configuration
const API_CONFIG = {
    // Railway backend URL - UPDATE THIS if your Railway domain changes
    BASE_URL: 'https://eezlegal-production.up.railway.app',
    
    // API endpoints
    ENDPOINTS: {
        CHAT: '/api/chat',
        AUTH_GOOGLE: '/auth/google',
        AUTH_CALLBACK: '/auth/callback',
        TEST: '/api/test',
        CONFIG: '/api/config'
    }
};

// OAuth Configuration
const OAUTH_CONFIG = {
    // This should match your Railway backend domain
    CALLBACK_URL: 'https://eezlegal-production.up.railway.app/auth/callback',
    
    // Frontend URLs
    FRONTEND_URL: 'https://www.eezlegal.com',
    LOGIN_URL: 'https://www.eezlegal.com/login/',
    DASHBOARD_URL: 'https://www.eezlegal.com/dashboard/'
};

// Token management functions
function setAuthToken(token) {
    if (token) {
        localStorage.setItem('auth_token', token);
        console.log('✅ Auth token stored');
    }
}

function getAuthToken() {
    const token = localStorage.getItem('auth_token');
    console.log('🔍 Getting auth token:', token ? '✅ Found' : '❌ Not found');
    return token;
}

function removeAuthToken() {
    localStorage.removeItem('auth_token');
    console.log('🗑️ Auth token removed');
}

function isAuthenticated() {
    const token = getAuthToken();
    return !!token;
}

// API helper functions
async function makeAPIRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || `HTTP ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('❌ API Request failed:', error);
        throw error;
    }
}

// FIXED OAuth helper functions
function initiateGoogleAuth() {
    console.log('🔄 Initiating Google OAuth...');
    const authUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_GOOGLE}`;
    console.log('📍 Redirecting to:', authUrl);
    
    // FIXED: Use direct redirect instead of fetch
    // OAuth flows must use browser redirects, not AJAX requests
    window.location.href = authUrl;
}

function logout() {
    console.log('👋 Logging out...');
    removeAuthToken();
    window.location.href = OAUTH_CONFIG.LOGIN_URL;
}

// Configuration check function
async function checkBackendConnection() {
    try {
        const response = await makeAPIRequest(API_CONFIG.ENDPOINTS.CONFIG);
        console.log('✅ Backend connection successful:', response);
        return response;
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        return null;
    }
}

// Token extraction from URL (for OAuth callback)
function extractTokenFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (token) {
        console.log('✅ Token found in URL, storing...');
        setAuthToken(token);
        
        // Clean URL by removing token parameter
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        return token;
    }
    
    if (error) {
        console.error('❌ OAuth error in URL:', error);
        return null;
    }
    
    return null;
}

// Initialize authentication on page load
function initializeAuth() {
    // Check if we're on a page that should extract tokens
    if (window.location.pathname.includes('/dashboard/')) {
        const token = extractTokenFromURL();
        if (token) {
            console.log('✅ Authentication successful, token stored');
            return true;
        }
    }
    
    // Check if user is already authenticated
    return isAuthenticated();
}

// Export configuration for use in other scripts
window.EezLegalConfig = {
    API_CONFIG,
    OAUTH_CONFIG,
    setAuthToken,
    getAuthToken,
    removeAuthToken,
    isAuthenticated,
    makeAPIRequest,
    initiateGoogleAuth,
    logout,
    checkBackendConnection,
    extractTokenFromURL,
    initializeAuth
};

console.log('🔧 EezLegal configuration loaded');
console.log('📍 Backend URL:', API_CONFIG.BASE_URL);
console.log('🔑 OAuth Callback:', OAUTH_CONFIG.CALLBACK_URL);

// Auto-initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    const isAuth = initializeAuth();
    console.log('🔐 Authentication status:', isAuth ? 'Authenticated' : 'Not authenticated');
});
