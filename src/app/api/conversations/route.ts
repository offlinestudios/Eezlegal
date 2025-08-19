import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const userId = searchParams.get('userId')
    const anonSessionId = searchParams.get('anonSessionId')

    if (!userId && !anonSessionId) {
      return NextResponse.json({ error: 'User ID or anonymous session ID required' }, { status: 400 })
    }

    const conversations = await prisma.conversation.findMany({
      where: userId ? { userId } : { anonSessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1 // Only get the first message for preview
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1
      })
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, userId, anonSessionId } = body

    if (!userId && !anonSessionId) {
      return NextResponse.json({ error: 'User ID or anonymous session ID required' }, { status: 400 })
    }

    const conversation = await prisma.conversation.create({
      data: {
        title: title || 'New conversation',
        userId,
        anonSessionId
      }
    })

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

