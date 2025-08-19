'use client'

import { useState, useEffect } from 'react'
import { AuthState } from '@/types/auth'

interface Usage {
  msgCount: number
  dailyLimit: number
}

interface NudgeState {
  type: 'signup' | 'upgrade' | 'quota' | null
  reason?: string
  show: boolean
}

export function useNudges(authState: AuthState, usage: Usage) {
  const [nudge, setNudge] = useState<NudgeState>({ type: null, show: false })

  useEffect(() => {
    // Anonymous user nudges
    if (authState === 'LOGGED_OUT') {
      if (usage.msgCount >= 3) {
        setNudge({ type: 'signup', show: true })
      }
      return
    }

    // Free user nudges
    if (authState === 'LOGGED_IN_FREE') {
      // Quota warning at 80%
      if (usage.msgCount / usage.dailyLimit >= 0.8) {
        setNudge({ type: 'quota', show: true })
      }
    }
  }, [authState, usage])

  const showUpgradeModal = (reason: string) => {
    setNudge({ type: 'upgrade', reason, show: true })
  }

  const dismissNudge = () => {
    setNudge(prev => ({ ...prev, show: false }))
  }

  return {
    nudge,
    showUpgradeModal,
    dismissNudge
  }
}

