import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateId } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          plan: 'FREE'
        }
      })
    }

    // Create session token
    const sessionToken = generateId() + generateId() // Extra long token
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.session.create({
      data: {
        id: sessionToken,
        userId: user.id,
        expiresAt
      }
    })

    // In a real app, you would send an email here
    // For demo purposes, we'll return the magic link
    const magicLink = `${process.env.APP_URL}/auth/callback?token=${sessionToken}`

    // TODO: Send email with magic link
    console.log('Magic link:', magicLink)

    return NextResponse.json({ 
      success: true, 
      message: 'Magic link sent to your email',
      // Remove this in production:
      magicLink 
    })
  } catch (error) {
    console.error('Error creating magic link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

