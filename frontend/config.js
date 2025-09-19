// EezLegal Frontend Configuration

// Backend API URL - Update this to match your Railway deployment
const BACKEND_URL = 'https://eezlegal-production.up.railway.app';

// Frontend configuration
const CONFIG = {
    // API endpoints
    api: {
        base: BACKEND_URL,
        auth: {
            google: `${BACKEND_URL}/auth/google`,
            verify: `${BACKEND_URL}/api/auth/verify`,
            callback: `${BACKEND_URL}/auth/google/callback`
        },
        chat: `${BACKEND_URL}/api/chat`,
        chats: `${BACKEND_URL}/api/chats`,
        health: `${BACKEND_URL}/health`
    },
    
    // Application settings
    app: {
        name: 'EezLegal',
        version: '1.0.0',
        description: 'Your AI Legal Assistant'
    },
    
    // UI settings
    ui: {
        theme: 'light',
        maxChatHistory: 50,
        messageMaxLength: 2000,
        autoSaveInterval: 30000 // 30 seconds
    },
    
    // Storage keys
    storage: {
        token: 'eezlegal_token',
        user: 'eezlegal_user',
        preferences: 'eezlegal_preferences'
    }
};

// Make configuration available globally
window.EEZLEGAL_CONFIG = CONFIG;

// Utility functions
window.EezLegalUtils = {
    // Get stored token
    getToken: () => localStorage.getItem(CONFIG.storage.token),
    
    // Set token
    setToken: (token) => localStorage.setItem(CONFIG.storage.token, token),
    
    // Remove token
    removeToken: () => localStorage.removeItem(CONFIG.storage.token),
    
    // Check if user is authenticated
    isAuthenticated: () => !!window.EezLegalUtils.getToken(),
    
    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Truncate text
    truncateText: (text, maxLength = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    // API request helper
    apiRequest: async (endpoint, options = {}) => {
        const token = window.EezLegalUtils.getToken();
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            headers: defaultHeaders,
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(`${BACKEND_URL}${endpoint}`, config);
            
            if (response.status === 401) {
                // Token expired or invalid
                window.EezLegalUtils.removeToken();
                window.location.href = '/login/';
                return null;
            }
            
            return response;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
};

console.log('✅ EezLegal configuration loaded');
console.log('🔗 Backend URL:', BACKEND_URL);
