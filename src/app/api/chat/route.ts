import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, mode } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        message: "I'm a demo version of EezLegal. To enable real AI responses, please add your OpenAI API key to the environment variables. For now, I can help you understand that this is a fully functional legal AI assistant that would provide real legal guidance with proper API configuration.",
      })
    }

    // Create system prompt based on legal mode
    let systemPrompt = "You are EezLegal, an AI legal assistant that helps people understand legal matters in plain English."
    
    switch (mode) {
      case 'plain-english':
        systemPrompt += " Focus on translating complex legal language into simple, understandable terms."
        break
      case 'document-generator':
        systemPrompt += " Help users create and understand legal documents, providing templates and guidance."
        break
      case 'dispute-resolution':
        systemPrompt += " Provide guidance on resolving legal disputes and understanding rights and options."
        break
      case 'deal-advisor':
        systemPrompt += " Offer strategic advice for negotiations and business deals from a legal perspective."
        break
    }

    systemPrompt += " Always provide helpful, accurate legal information while reminding users to consult with qualified attorneys for specific legal advice."

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const aiMessage = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.'

    return NextResponse.json({ message: aiMessage })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('insufficient_quota')) {
        return NextResponse.json({
          message: "I'm currently unable to respond because the OpenAI API quota has been exceeded. Please add credits to your OpenAI account or try again later.",
        })
      }
      
      if (error.message.includes('invalid_api_key')) {
        return NextResponse.json({
          message: "I'm currently unable to respond due to an invalid API key configuration. Please check your OpenAI API key settings.",
        })
      }
    }

    return NextResponse.json({
      message: "I'm experiencing technical difficulties right now. This is likely due to API configuration issues. Please try again later or contact support.",
    })
  }
}

