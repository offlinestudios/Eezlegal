'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { Mic, Paperclip, HelpCircle } from 'lucide-react'

export default function Home() {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const [isFirstMessage, setIsFirstMessage] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    // Redirect to app for actual chat functionality
    window.location.href = '/app'
  }

  const toggleButtons = () => {
    return message.trim().length > 0
  }

  return (
    <div className="min-h-screen bg-chat-bg flex flex-col">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 h-14 bg-chat-bg border-b border-chat-border z-50 flex items-center justify-between px-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className={`text-lg font-semibold text-chat-text ${!isFirstMessage ? 'block' : 'hidden'}`}>
            eezlegal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link 
              href="/login" 
              className="px-3 py-2 text-sm text-chat-text hover:bg-gray-100 rounded-lg transition-colors"
            >
              Log in
            </Link>
            <Link 
              href={session ? "/app" : "/login"}
              className="px-3 py-2 text-sm bg-chat-text text-white hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              {session ? "Open App" : "Sign up for free"}
            </Link>
          </div>
          <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 border border-chat-border rounded-full flex items-center justify-center transition-colors">
            <HelpCircle className="w-4 h-4 text-chat-text" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-14">
        <div className="w-full max-w-3xl mx-auto">
          {/* Welcome Section */}
          <div className={`text-center mb-9 ${!isFirstMessage ? 'hidden' : 'block'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-chat-text mb-0 tracking-tight">
              eezlegal
            </h1>
          </div>

          {/* Chat Messages Area (empty initially) */}
          <div className="mb-6 space-y-4">
            {/* Messages will appear here */}
          </div>

          {/* Composer Section */}
          <div className="w-full">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end bg-white border border-chat-border rounded-3xl p-2 shadow-sm">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us your legal problem..."
                  className="flex-1 resize-none border-none outline-none px-3 py-3 text-base placeholder-chat-text-dim min-h-[24px] max-h-32"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <button
                  type={toggleButtons() ? "submit" : "button"}
                  className={`ml-2 px-4 py-2 rounded-2xl font-medium text-sm transition-all flex items-center gap-2 ${
                    toggleButtons()
                      ? 'bg-chat-text text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-chat-text hover:bg-gray-200 border border-chat-border'
                  }`}
                >
                  {toggleButtons() ? (
                    <span>Send</span>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Voice</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Upload Section */}
            <div className="mt-4 flex justify-start">
              <button 
                className="flex items-center gap-2 px-3 py-2 text-sm text-chat-text-dim border border-dashed border-chat-border rounded-lg hover:bg-gray-50 hover:text-chat-text hover:border-solid transition-all"
              >
                <Paperclip className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

