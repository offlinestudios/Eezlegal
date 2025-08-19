import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { AuthState, AuthContext } from '@/types/auth'

export async function getAuthContext(): Promise<AuthContext> {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value
  const anonSessionId = cookieStore.get('anonSessionId')?.value

  if (sessionToken) {
    try {
      const session = await prisma.session.findUnique({
        where: { id: sessionToken },
        include: { user: true }
      })

      if (session && session.expiresAt > new Date()) {
        const authState: AuthState = session.user.plan === 'FREE' 
          ? 'LOGGED_IN_FREE'
          : session.user.plan === 'PLUS'
          ? 'LOGGED_IN_PLUS'
          : 'LOGGED_IN_PRO'

        return {
          authState,
          user: session.user
        }
      }
    } catch (error) {
      console.error('Error verifying session:', error)
    }
  }

  return {
    authState: 'LOGGED_OUT',
    anonSessionId
  }
}

export function generateAnonSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function ensureAnonSession(): Promise<string> {
  const cookieStore = cookies()
  let anonSessionId = cookieStore.get('anonSessionId')?.value

  if (!anonSessionId) {
    anonSessionId = generateAnonSessionId()
    
    // Create anonymous session in database
    await prisma.anonSession.create({
      data: { id: anonSessionId }
    })

    // Set cookie (this won't work in server components, needs middleware)
    // cookieStore.set('anonSessionId', anonSessionId, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 30 * 24 * 60 * 60 // 30 days
    // })
  }

  return anonSessionId
}

