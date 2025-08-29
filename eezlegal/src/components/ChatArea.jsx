import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Message from './Message'

const ChatArea = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-4">
                Okay — tell me what's going on, and I'll help.
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                Start by describing your legal situation or question.
              </p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 space-y-6">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your legal question..."
              className="w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent pr-12 md:pr-16"
              style={{ fontSize: '16px' }} // Prevent zoom on iOS
            />
            {inputValue.trim() && (
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-3 md:px-4 py-2 h-8 md:h-10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatArea

