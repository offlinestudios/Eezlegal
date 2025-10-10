import { createContext, useContext, useState, useEffect } from 'react'
import backendService from '../services/backendService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    // Check backend availability and auth status on app load
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Test backend connection
      const backendTest = await backendService.testConnection()
      setBackendStatus(backendTest.success ? 'connected' : 'unavailable')

      // Check for existing session
      const token = localStorage.getItem('eezlegal_token')
      if (token && backendTest.success) {
        const result = await backendService.verifyToken(token)
        if (result.success) {
          setUser(result.user)
          setIsLoggedIn(true)
        } else {
          localStorage.removeItem('eezlegal_token')
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      setBackendStatus('error')
      localStorage.removeItem('eezlegal_token')
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Redirect to backend Google OAuth
      const googleUrl = backendService.getGoogleAuthUrl()
      window.location.href = googleUrl
    } catch (error) {
      console.error('Google sign in failed:', error)
      throw error
    }
  }

  const signInWithMicrosoft = async () => {
    try {
      // Redirect to backend Microsoft OAuth
      const microsoftUrl = backendService.getMicrosoftAuthUrl()
      window.location.href = microsoftUrl
    } catch (error) {
      console.error('Microsoft sign in failed:', error)
      throw error
    }
  }

  const signInWithApple = async () => {
    try {
      // Redirect to backend Apple OAuth
      const appleUrl = backendService.getAppleAuthUrl()
      window.location.href = appleUrl
    } catch (error) {
      console.error('Apple sign in failed:', error)
      throw error
    }
  }

  const signInWithPhone = async (phoneNumber, verificationCode) => {
    try {
      if (backendStatus !== 'connected') {
        return { 
          success: false, 
          error: 'Backend service unavailable. Please try again later.' 
        }
      }

      const result = await backendService.verifyPhoneCode(phoneNumber, verificationCode)
      
      if (result.success) {
        setUser(result.user)
        setIsLoggedIn(true)
        return { success: true }
      }
      
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Phone sign in failed:', error)
      return { success: false, error: 'Sign in failed. Please try again.' }
    }
  }

  const sendPhoneVerification = async (phoneNumber) => {
    try {
      if (backendStatus !== 'connected') {
        return { 
          success: false, 
          error: 'Backend service unavailable. Please try again later.' 
        }
      }

      const result = await backendService.sendPhoneVerification(phoneNumber)
      return result
    } catch (error) {
      console.error('Phone verification failed:', error)
      return { success: false, error: 'Failed to send verification code.' }
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      if (backendStatus !== 'connected') {
        return { 
          success: false, 
          error: 'Backend service unavailable. Please try again later.' 
        }
      }

      const result = await backendService.signInWithEmail(email, password)
      
      if (result.success) {
        setUser(result.user)
        setIsLoggedIn(true)
        return { success: true }
      }
      
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Email sign in failed:', error)
      return { success: false, error: 'Sign in failed. Please try again.' }
    }
  }

  const signUp = async (name, email, password) => {
    try {
      if (backendStatus !== 'connected') {
        return { 
          success: false, 
          error: 'Backend service unavailable. Please try again later.' 
        }
      }

      const result = await backendService.signUp(name, email, password)
      
      if (result.success) {
        setUser(result.user)
        setIsLoggedIn(true)
        return { success: true }
      }
      
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Sign up failed:', error)
      return { success: false, error: 'Sign up failed. Please try again.' }
    }
  }

  const signOut = async () => {
    try {
      await backendService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user?.id || backendStatus !== 'connected') {
        return { success: false, error: 'Unable to update profile' }
      }

      const result = await backendService.updateUserProfile(user.id, updates)
      
      if (result.success) {
        setUser(result.user)
        return { success: true }
      }
      
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Profile update failed:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  // Handle OAuth callback (called from URL parameters)
  const handleOAuthCallback = async (token) => {
    try {
      if (token && backendStatus === 'connected') {
        localStorage.setItem('eezlegal_token', token)
        const result = await backendService.verifyToken(token)
        
        if (result.success) {
          setUser(result.user)
          setIsLoggedIn(true)
          return { success: true }
        }
      }
      
      return { success: false, error: 'OAuth authentication failed' }
    } catch (error) {
      console.error('OAuth callback failed:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  const value = {
    user,
    isLoggedIn,
    isLoading,
    backendStatus,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithApple,
    signInWithPhone,
    sendPhoneVerification,
    signInWithEmail,
    signUp,
    signOut,
    updateProfile,
    handleOAuthCallback,
    // Utility methods
    isBackendAvailable: () => backendStatus === 'connected',
    getBackendStatus: () => backendStatus,
    refreshAuth: initializeAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
