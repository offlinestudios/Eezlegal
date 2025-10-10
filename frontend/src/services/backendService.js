import axios from 'axios'

// Backend configuration
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 
                        process.env.BACKEND_URL || 
                        'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eezlegal_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('eezlegal_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export class BackendService {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health')
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Configuration
  async getConfig() {
    try {
      const response = await api.get('/api/config')
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Authentication methods
  async signInWithEmail(email, password) {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      })
      
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('eezlegal_token', token)
        return { success: true, user, token }
      }
      
      return { success: false, error: response.data.error }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      }
    }
  }

  async signUp(name, email, password) {
    try {
      const response = await api.post('/api/auth/signup', {
        name,
        email,
        password
      })
      
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('eezlegal_token', token)
        return { success: true, user, token }
      }
      
      return { success: false, error: response.data.error }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Sign up failed. Please try again.' 
      }
    }
  }

  async verifyToken(token) {
    try {
      const response = await api.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        return { success: true, user: response.data.user }
      }
      
      return { success: false, error: response.data.error }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async logout() {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('eezlegal_token')
    }
  }

  // OAuth methods
  getGoogleAuthUrl() {
    return `${BACKEND_BASE_URL}/auth/google`
  }

  getMicrosoftAuthUrl() {
    return `${BACKEND_BASE_URL}/auth/microsoft`
  }

  getAppleAuthUrl() {
    return `${BACKEND_BASE_URL}/auth/apple`
  }

  // Phone authentication
  async sendPhoneVerification(phoneNumber) {
    try {
      const response = await api.post('/api/auth/phone/send', {
        phoneNumber
      })
      
      return { 
        success: response.data.success, 
        error: response.data.error 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send verification code' 
      }
    }
  }

  async verifyPhoneCode(phoneNumber, verificationCode) {
    try {
      const response = await api.post('/api/auth/phone/verify', {
        phoneNumber,
        verificationCode
      })
      
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('eezlegal_token', token)
        return { success: true, user, token }
      }
      
      return { success: false, error: response.data.error }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Verification failed' 
      }
    }
  }

  // Chat methods
  async sendChatMessage(message, history = [], userId = null) {
    try {
      const response = await api.post('/api/chat', {
        message,
        history,
        user_id: userId
      })
      
      if (response.data.success) {
        return { 
          success: true, 
          message: response.data.message,
          usage: response.data.usage 
        }
      }
      
      return { success: false, error: response.data.error }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send message',
        fallback: true
      }
    }
  }

  // User methods
  async getUserProfile(userId) {
    try {
      const response = await api.get(`/api/user/${userId}`)
      return { success: true, user: response.data.user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get user profile' 
      }
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      const response = await api.put(`/api/user/${userId}`, updates)
      return { success: true, user: response.data.user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update profile' 
      }
    }
  }

  // Stripe integration methods
  async createCheckoutSession(priceId, userId, userEmail) {
    try {
      const response = await api.post('/api/stripe/create-checkout-session', {
        priceId,
        userId,
        userEmail,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/upgrade`
      })
      
      if (response.data.success) {
        return { success: true, sessionId: response.data.sessionId }
      }
      
      return { success: false, error: response.data.error }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to create checkout session' 
      }
    }
  }

  async getSubscriptionStatus(userId) {
    try {
      const response = await api.get(`/api/stripe/subscription-status/${userId}`)
      return { 
        success: true, 
        subscription: response.data.subscription 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get subscription status' 
      }
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await api.post('/api/stripe/cancel-subscription', {
        subscriptionId
      })
      
      return { 
        success: response.data.success, 
        error: response.data.error 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to cancel subscription' 
      }
    }
  }

  // File upload methods
  async uploadDocument(file, userId) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)
      
      const response = await api.post('/api/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return { 
        success: true, 
        fileId: response.data.fileId,
        fileName: response.data.fileName 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to upload document' 
      }
    }
  }

  async analyzeDocument(fileId, userId) {
    try {
      const response = await api.post('/api/analyze/document', {
        fileId,
        userId
      })
      
      return { 
        success: true, 
        analysis: response.data.analysis 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to analyze document' 
      }
    }
  }

  // Utility methods
  isBackendAvailable() {
    return this.healthCheck()
  }

  getBackendUrl() {
    return BACKEND_BASE_URL
  }

  // Test connection with fallback
  async testConnection() {
    try {
      const health = await this.healthCheck()
      if (health.success) {
        return { success: true, backend: 'connected', url: BACKEND_BASE_URL }
      }
      
      return { success: false, backend: 'unavailable', url: BACKEND_BASE_URL }
    } catch (error) {
      return { 
        success: false, 
        backend: 'error', 
        error: error.message,
        url: BACKEND_BASE_URL 
      }
    }
  }
}

export default new BackendService()
