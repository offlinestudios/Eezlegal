import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/auth/error?error=missing_token', request.url))
    }

    // Verify session token
    const session = await prisma.session.findUnique({
      where: { id: token },
      include: { user: true }
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.redirect(new URL('/auth/error?error=invalid_token', request.url))
    }

    // Get anonymous session ID from cookies to migrate conversations
    const cookieStore = cookies()
    const anonSessionId = cookieStore.get('anonSessionId')?.value

    // Migrate anonymous conversations to user account
    if (anonSessionId) {
      await prisma.conversation.updateMany({
        where: { anonSessionId },
        data: { 
          userId: session.userId,
          anonSessionId: null 
        }
      })
    }

    // Set auth cookie
    const response = NextResponse.redirect(new URL('/chat', request.url))
    response.cookies.set('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    // Clear anonymous session
    if (anonSessionId) {
      response.cookies.delete('anonSessionId')
    }

    return response
  } catch (error) {
    console.error('Error in auth callback:', error)
    return NextResponse.redirect(new URL('/auth/error?error=server_error', request.url))
  }
}

