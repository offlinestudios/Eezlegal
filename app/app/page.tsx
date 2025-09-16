'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Settings, CreditCard, LogOut, Menu, X, Send, Paperclip } from 'lucide-react'
import Link from 'next/link'

interface Conversation {
  id: string
  title: string
  createdAt: string
}

export default function AppHome() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load conversations
    fetchConversations()
  }, [])

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
        setConversations(prev => [newConversation, ...prev])
        // Navigate to new conversation
        window.location.href = `/app/c/${newConversation.id}`
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    try {
      // Create new conversation if none exists
      await createNewChat()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
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
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/app/c/${conversation.id}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-chat-text hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <MessageSquare className="w-4 h-4 text-chat-text-dim" />
                  <span className="flex-1 truncate">{conversation.title}</span>
                </Link>
              ))
            ) : (
              <div className="px-3 py-8 text-center">
                <MessageSquare className="w-8 h-8 text-chat-text-dim mx-auto mb-2" />
                <p className="text-sm text-chat-text-dim">No conversations yet</p>
                <p className="text-xs text-chat-text-dim mt-1">Start a new chat to begin</p>
              </div>
            )}
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
            <div className="font-medium text-chat-text">EezLegal</div>
          </div>
          <div className="flex items-center gap-2">
            {/* Model selector placeholder */}
            <select className="px-3 py-1 text-sm border border-chat-border rounded-lg bg-white">
              <option>GPT-4</option>
            </select>
          </div>
        </header>

        {/* Messages Area */}
        <section className="flex-1 overflow-auto chat-scrollbar">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-chat-text rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h2 className="text-2xl font-semibold text-chat-text mb-2">
                How can I help you today?
              </h2>
              <p className="text-chat-text-dim mb-8">
                Ask me anything about legal matters, contracts, or get legal advice.
              </p>
              
              {/* Quick suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <button className="p-4 text-left border border-chat-border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-chat-text mb-1">Review a contract</div>
                  <div className="text-sm text-chat-text-dim">Upload and analyze legal documents</div>
                </button>
                <button className="p-4 text-left border border-chat-border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-chat-text mb-1">Legal advice</div>
                  <div className="text-sm text-chat-text-dim">Get guidance on legal matters</div>
                </button>
                <button className="p-4 text-left border border-chat-border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-chat-text mb-1">Draft documents</div>
                  <div className="text-sm text-chat-text-dim">Create legal letters and forms</div>
                </button>
                <button className="p-4 text-left border border-chat-border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-chat-text mb-1">Explain legal terms</div>
                  <div className="text-sm text-chat-text-dim">Understand complex legal language</div>
                </button>
              </div>
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

