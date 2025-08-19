'use client'

import { useState, useEffect } from 'react'
import { AuthContext } from '@/types/auth'

export function useAuth() {
  const [authContext, setAuthContext] = useState<AuthContext>({
    authState: 'LOGGED_OUT'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch auth state from server
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setAuthContext(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching auth state:', error)
        setLoading(false)
      })
  }, [])

  const login = async (email: string) => {
    const response = await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return response.json()
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuthContext({ authState: 'LOGGED_OUT' })
    window.location.href = '/'
  }

  return {
    ...authContext,
    loading,
    login,
    logout,
    isAuthenticated: authContext.authState !== 'LOGGED_OUT',
    hasHistory: authContext.authState !== 'LOGGED_OUT',
    canUploadFiles: authContext.user?.plan !== 'FREE',
    dailyQuota: authContext.user?.plan === 'FREE' ? 10 : Infinity
  }
}

