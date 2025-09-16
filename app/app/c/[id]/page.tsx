'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Settings, CreditCard, LogOut, Menu, X, Send, Paperclip, User, Bot } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface Conversation {
  id: string
  title: string
  createdAt: string
  messages: Message[]
}

export default function ConversationPage() {
  const { data: session } = useSession()
  const params = useParams()
  const conversationId = params.id as string
  
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (conversationId) {
      fetchConversation()
      fetchConversations()
    }
  }, [conversationId])

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setConversation(data)
      }
    } catch (error) {
      console.error('Failed to fetch conversation:', error)
    }
  }

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' })
      })
      
      if (response.ok) {
        const newConversation = await response.json()
        window.location.href = `/app/c/${newConversation.id}`
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage = message
    setMessage('')
    setIsLoading(true)

    try {
      // Add user message to UI immediately
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        createdAt: new Date().toISOString()
      }

      setConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newUserMessage]
      } : null)

      // Send message to API
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMessage })
      })

      if (response.ok) {
        // For now, add a simple echo response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I received your message: "${userMessage}". This is a placeholder response. The actual AI integration will be implemented later.`,
          createdAt: new Date().toISOString()
        }

        setConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, assistantMessage]
        } : null)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  if (!conversation) {
    return (
      <div className="flex h-screen bg-chat-bg items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chat-text mx-auto mb-4"></div>
          <p className="text-chat-text-dim">Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-chat-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50
        w-72 bg-chat-surface border-r border-chat-border flex flex-col
        transition-transform duration-300 ease-in-out
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-chat-border">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-chat-text">eezlegal</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-3 py-2 bg-chat-text text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-auto p-2 chat-scrollbar">
          <div className="space-y-1">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/app/c/${conv.id}`}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors group ${
                  conv.id === conversationId 
                    ? 'bg-gray-100 text-chat-text' 
                    : 'text-chat-text hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-chat-text-dim" />
                <span className="flex-1 truncate">{conv.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div className="p-4 border-t border-chat-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-chat-text">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-chat-text truncate">
                {session?.user?.name || session?.user?.email}
              </p>
              <p className="text-xs text-chat-text-dim">Free Plan</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-chat-text hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-chat-text hover:bg-gray-100 rounded-lg transition-colors">
              <CreditCard className="w-4 h-4" />
              <span>Upgrade Plan</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-chat-text hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-chat-border bg-chat-surface flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-medium text-chat-text">{conversation.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1 text-sm border border-chat-border rounded-lg bg-white">
              <option>GPT-4</option>
            </select>
          </div>
        </header>

        {/* Messages Area */}
        <section className="flex-1 overflow-auto chat-scrollbar">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="space-y-6">
              {conversation.messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {msg.role === 'user' ? (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {session?.user?.image ? (
                          <img 
                            src={session.user.image} 
                            alt="User" 
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4 text-chat-text" />
                        )}
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-chat-text rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-chat-text whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-chat-text rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-chat-text-dim rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-chat-text-dim rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-chat-text-dim rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Composer */}
        <footer className="border-t border-chat-border bg-chat-surface p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="flex items-end bg-white border border-chat-border rounded-2xl p-2 shadow-sm">
                <button
                  type="button"
                  className="p-2 text-chat-text-dim hover:text-chat-text transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message EezLegal..."
                  className="flex-1 resize-none border-none outline-none px-3 py-3 text-base placeholder-chat-text-dim min-h-[24px] max-h-32"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="p-2 text-chat-text-dim hover:text-chat-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            <p className="text-xs text-chat-text-dim text-center mt-2">
              EezLegal can make mistakes. Consider checking important information.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

