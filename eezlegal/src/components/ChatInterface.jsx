import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'

const ChatInterface = ({ setIsLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])

  // Set sidebar open by default on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    handleResize() // Set initial state
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNewChat = () => {
    setCurrentChat(null)
    setMessages([])
    // Close sidebar on mobile after action
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I understand your legal question. Let me help you with that. This is a simulated response for now.",
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
          <div className="text-lg font-medium text-gray-900">
            ezlegal
          </div>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        {/* Chat Area */}
        <ChatArea 
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  )
}

export default ChatInterface

