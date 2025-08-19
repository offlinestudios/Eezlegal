'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, FileText, Scale, Handshake, Send, Plus } from "lucide-react"
import { generateId } from "@/lib/utils"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const legalModes = [
  {
    id: 'plain-english',
    name: 'Plain English',
    icon: MessageSquare,
    description: 'I\'m here to help you with plain english. I need help translating complex legal documents into plain English that I can understand.',
  },
  {
    id: 'document-generator',
    name: 'Document Generator',
    icon: FileText,
    description: 'I\'m here to help you generate documents. I need help creating professional legal documents tailored to your specific needs.',
  },
  {
    id: 'dispute-resolution',
    name: 'Dispute Resolution',
    icon: Scale,
    description: 'I\'m here to help you with dispute resolution. I need guidance on resolving disputes and recovering what I\'m owed.',
  },
  {
    id: 'deal-advisor',
    name: 'Deal Advisor',
    icon: Handshake,
    description: 'I\'m here to help you with deal advice. I need suggestions and strategies to win every deal and negotiation.',
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleModeSelect = (mode: typeof legalModes[0]) => {
    setSelectedMode(mode.id)
    const initialMessage: Message = {
      id: generateId(),
      role: 'user',
      content: mode.description,
      timestamp: new Date(),
    }
    setMessages([initialMessage])
    
    // Add a mock AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: generateId(),
        role: 'assistant',
        content: `I understand you need help with ${mode.name.toLowerCase()}. I'm here to assist you with that. Please provide more details about your specific situation, and I'll do my best to help you understand the legal aspects in plain English.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Mock AI response (in production, this would call your API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: generateId(),
        role: 'assistant',
        content: `I understand your question about "${input.trim()}". This is a mock response. In the production version, this would connect to the OpenAI API to provide real legal assistance. Please add your OpenAI API key to the environment variables to enable real AI responses.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const startNewChat = () => {
    setMessages([])
    setSelectedMode(null)
    setInput('')
  }

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">EezLegal</span>
              </div>
              <Button variant="ghost" onClick={startNewChat}>
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </header>

        {/* Mode Selection */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">
            Choose Your Legal Mode
          </h1>
          <div className="grid gap-4">
            {legalModes.map((mode) => {
              const Icon = mode.icon
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode)}
                  className="flex items-center gap-4 p-6 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <Icon className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{mode.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {mode.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold">EezLegal</span>
            </div>
            <Button variant="ghost" onClick={startNewChat}>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 ${
                message.role === 'user' ? 'ml-12' : 'mr-12'
              }`}
            >
              <div
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mr-12 mb-6">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

