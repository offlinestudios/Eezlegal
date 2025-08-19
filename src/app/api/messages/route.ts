import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, content, mode, userId, anonSessionId } = body

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: { text: content }
      }
    })

    // Get conversation history for context
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20 // Limit context to last 20 messages
    })

    // Prepare OpenAI messages
    const openaiMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: typeof msg.content === 'object' && msg.content && 'text' in msg.content 
        ? (msg.content as any).text 
        : String(msg.content)
    }))

    // Add system prompt based on mode
    if (mode) {
      openaiMessages.unshift({
        role: 'system',
        content: mode.prompt
      })
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: openaiMessages,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const assistantContent = completion.choices[0]?.message?.content || 'Sorry, I encountered an error.'

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: { text: assistantContent },
        tokens: completion.usage?.total_tokens
      }
    })

    // Update conversation title if it's the first exchange
    const messageCount = await prisma.message.count({
      where: { conversationId }
    })

    if (messageCount <= 2) {
      const title = content.length > 50 ? content.substring(0, 50) + '...' : content
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { title }
      })
    }

    return NextResponse.json({ 
      userMessage, 
      assistantMessage,
      usage: completion.usage 
    })
  } catch (error) {
    console.error('Error creating message:', error)
    
    // Save error message
    if (body?.conversationId) {
      await prisma.message.create({
        data: {
          conversationId: body.conversationId,
          role: 'assistant',
          content: { text: 'Sorry, I encountered an error. Please try again.' }
        }
      }).catch(console.error)
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

