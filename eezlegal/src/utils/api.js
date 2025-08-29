// API utility functions for Eezlegal backend integration

const API_BASE_URL = '/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
    return null;
  }
  
  return response;
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
  
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  
  getCurrentUser: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/me`);
    if (!response) return null;
    return response.json();
  },
  
  logout: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return response ? response.json() : null;
  },
  
  updateProfile: async (profileData) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response ? response.json() : null;
  },
  
  changePassword: async (passwordData) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
    return response ? response.json() : null;
  },
  
  getUsageStats: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/users/usage`);
    return response ? response.json() : null;
  },
};

// Chat API
export const chatAPI = {
  getConversations: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/conversations`);
    return response ? response.json() : [];
  },
  
  createConversation: async (title) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return response ? response.json() : null;
  },
  
  getConversation: async (conversationId) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/conversations/${conversationId}`);
    return response ? response.json() : null;
  },
  
  sendMessage: async (conversationId, message) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return response ? response.json() : null;
  },
  
  deleteConversation: async (conversationId) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'DELETE',
    });
    return response ? response.json() : null;
  },
  
  updateConversationTitle: async (conversationId, title) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/conversations/${conversationId}/title`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
    return response ? response.json() : null;
  },
};

// Documents API
export const documentsAPI = {
  getDocuments: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/documents`);
    return response ? response.json() : [];
  },
  
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
      return null;
    }
    
    return response.json();
  },
  
  getDocument: async (documentId) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/documents/${documentId}`);
    return response ? response.json() : null;
  },
  
  downloadDocument: async (documentId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
  
  analyzeDocument: async (documentId, prompt = '') => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/documents/${documentId}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    return response ? response.json() : null;
  },
  
  deleteDocument: async (documentId) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
    });
    return response ? response.json() : null;
  },
};

// Payments API
export const paymentsAPI = {
  getPricing: async () => {
    const response = await fetch(`${API_BASE_URL}/pricing`);
    return response.json();
  },
  
  createPaymentIntent: async (planType) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({ plan_type: planType }),
    });
    return response ? response.json() : null;
  },
  
  confirmPayment: async (paymentIntentId) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    });
    return response ? response.json() : null;
  },
  
  getSubscriptionStatus: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/subscription/status`);
    return response ? response.json() : null;
  },
  
  cancelSubscription: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/subscription/cancel`, {
      method: 'POST',
    });
    return response ? response.json() : null;
  },
  
  getPaymentHistory: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/payments/history`);
    return response ? response.json() : [];
  },
};

// Auth helper functions
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

