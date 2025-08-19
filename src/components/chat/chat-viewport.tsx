'use client'

import { useState } from 'react'
import { MessageList } from './message-list'
import { Composer } from './composer'
import { LegalModes } from './legal-modes'
import { Message, LegalMode } from '@/types/chat'
import { generateId } from '@/lib/utils'

interface ChatViewportProps {
  initialMessages?: Message[]
  onSendMessage?: (message: string, mode?: LegalMode) => Promise<void>
}

export function ChatViewport({ initialMessages = [], onSendMessage }: ChatViewportProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState<LegalMode | null>(null)

  const handleSelectMode = (mode: LegalMode) => {
    setSelectedMode(mode)
    // Add system message for the selected mode
    const systemMessage: Message = {
      id: generateId(),
      role: 'system',
      content: mode.prompt,
      createdAt: new Date()
    }
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: `I'm here to help you with ${mode.name.toLowerCase()}. ${mode.description}`,
      createdAt: new Date()
    }
    setMessages([systemMessage, assistantMessage])
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      if (onSendMessage) {
        await onSendMessage(content, selectedMode || undefined)
      } else {
        // Mock response for development
        setTimeout(() => {
          const assistantMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: `I understand you're asking about: "${content}". This is a mock response. In the full version, I would provide detailed legal assistance based on your selected mode.`,
            createdAt: new Date()
          }
          setMessages(prev => [...prev, assistantMessage])
          setIsLoading(false)
        }, 1000)
        return
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {messages.length === 0 || !selectedMode ? (
        <div className="flex-1 flex items-center justify-center">
          <LegalModes onSelectMode={handleSelectMode} />
        </div>
      ) : (
        <MessageList messages={messages} isLoading={isLoading} />
      )}
      
      <Composer 
        onSend={handleSendMessage} 
        disabled={isLoading}
        placeholder={selectedMode ? `Ask about ${selectedMode.name.toLowerCase()}...` : "Ask anything..."}
      />
    </div>
  )
}

