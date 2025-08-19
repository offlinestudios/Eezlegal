import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('sessionToken')?.value

    if (sessionToken) {
      // Delete session from database
      await prisma.session.delete({
        where: { id: sessionToken }
      }).catch(() => {
        // Session might not exist, ignore error
      })
    }

    // Clear auth cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete('sessionToken')

    return response
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

