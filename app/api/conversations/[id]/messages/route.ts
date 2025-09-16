import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: { 
        id: params.id,
        userId: user.id 
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Create user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: params.id,
        role: 'user',
        content: { text: content }
      }
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    })

    // For now, create a simple echo response
    // In the future, this would integrate with OpenAI API
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: params.id,
        role: 'assistant',
        content: { 
          text: `I received your message: "${content}". This is a placeholder response. The actual AI integration will be implemented later.`
        }
      }
    })

    return NextResponse.json({
      userMessage,
      assistantMessage
    })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

