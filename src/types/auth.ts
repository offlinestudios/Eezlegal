export type AuthState = 'LOGGED_OUT' | 'LOGGED_IN_FREE' | 'LOGGED_IN_PLUS' | 'LOGGED_IN_PRO'

export type Plan = 'FREE' | 'PLUS' | 'PRO'

export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  plan: Plan
  stripeCustomerId?: string
  createdAt: Date
}

export interface AuthContext {
  authState: AuthState
  user?: User
  anonSessionId?: string
}

