// EezLegal Frontend Configuration - Fixed Version
// Addresses BACKEND_URL undefined issue

const API_CONFIG = {
    BASE_URL: 'https://eezlegal-production.up.railway.app',
    ENDPOINTS: {
        AUTH_GOOGLE: '/auth/google',
        AUTH_VERIFY: '/api/auth/verify',
        CHAT: '/api/chat',
        CHATS: '/api/chats'
    }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Token management functions
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
function isAuthenticated() {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
        // Basic token format check
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        // Check if token is expired (basic check)
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        return payload.exp > now;
    } catch (e) {
        return false;
    }
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login/';
        return false;
    }
    return true;
}

// Get user info from token
function getUserFromToken() {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        return {
            user_id: payload.user_id,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };
    } catch (e) {
        return null;
    }
}

// Logout function
function logout() {
    removeAuthToken();
    window.location.href = '/login/';
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        getApiUrl,
        setAuthToken,
        getAuthToken,
        removeAuthToken,
        isAuthenticated,
        requireAuth,
        getUserFromToken,
        logout
    };
}
