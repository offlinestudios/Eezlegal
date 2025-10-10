import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Send, Paperclip, Shield, User, Bot, Loader2, Crown, Settings } from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthModal from './components/AuthModal'
import UpgradePage from './components/UpgradePage'
import SuccessPage from './components/SuccessPage'
import chatService from './services/chatService'
import stripeService from './services/stripeService'
import './App.css'

function ChatInterface() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)

  const { user, isLoggedIn, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Check if user is returning
  useEffect(() => {
    if (!authLoading) {
      const hasVisited = localStorage.getItem('eezlegal_visited')
      if (hasVisited && !isLoggedIn) {
        setShowWelcomeModal(true)
      }
      localStorage.setItem('eezlegal_visited', 'true')
    }
  }, [isLoggedIn, authLoading])

  // Load subscription status
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadSubscriptionStatus()
    }
  }, [isLoggedIn, user])

  const loadSubscriptionStatus = async () => {
    try {
      const status = await stripeService.getSubscriptionStatus(user.id)
      if (status.success) {
        setSubscriptionStatus(status.subscription)
      }
    } catch (error) {
      console.error('Error loading subscription status:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { role: 'user', content: message.trim() }
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    // Check if user has reached free tier limits
    if (!isLoggedIn || !stripeService.hasActiveSubscription(subscriptionStatus)) {
      const messageCount = messages.filter(m => m.role === 'user').length + 1
      if (messageCount > 5) {
        // Show upgrade prompt
        const upgradeMessage = {
          role: 'assistant',
          content: `**You've reached your free limit!**

**What this means:**
• Free users get 5 questions per month
• You've used all your free questions
• Upgrade to Pro for unlimited access

**Pro benefits:**
• Unlimited legal questions
• Document upload & analysis
• Advanced AI insights
• Priority support

**Next steps:**
1. Upgrade to Pro for unlimited access
2. Or wait until next month for your free questions to reset

**Ready to upgrade?**
Click the upgrade button to unlock unlimited legal assistance.

*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`,
          metadata: {
            isUpgradePrompt: true,
            isFromAPI: false
          }
        }
        setMessages(prev => [...prev, upgradeMessage])
        setIsLoading(false)
        return
      }
    }

    // Prepare user context for OpenAI
    const userContext = {
      isLoggedIn,
      isPro: stripeService.hasActiveSubscription(subscriptionStatus),
      userId: user?.id,
      userName: user?.name
    }

    try {
      const response = await chatService.sendMessage(
        userMessage.content,
        messages.slice(-10), // Send last 10 messages for context
        userContext,
        () => setIsTyping(true), // onTypingStart
        () => setIsTyping(false) // onTypingEnd
      )

      if (response.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.message,
          metadata: {
            isFromAPI: response.isFromAPI,
            usage: response.usage
          }
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        // Handle error case
        const errorMessage = {
          role: 'assistant',
          content: response.message,
          metadata: {
            isFromAPI: false,
            error: response.error
          }
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: chatService.getDefaultErrorMessage(),
        metadata: {
          isFromAPI: false,
          error: error.message
        }
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg max-w-xs">
      <Bot className="w-5 h-5 text-gray-600" />
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  )

  const MessageContent = ({ content, role, metadata }) => {
    if (role === 'user') {
      return <div className="whitespace-pre-wrap">{content}</div>
    }

    // Format assistant messages with proper styling
    const lines = content.split('\n')
    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          const trimmedLine = line.trim()
          
          if (!trimmedLine) {
            return <div key={index} className="h-2" />
          }

          // Bold headings (lines starting and ending with **)
          if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
            return (
              <div key={index} className="font-bold text-gray-900 mb-2">
                {trimmedLine.slice(2, -2)}
              </div>
            )
          }

          // Bullet points (lines starting with •)
          if (trimmedLine.startsWith('• ')) {
            return (
              <div key={index} className="ml-4 mb-1 flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <span>{trimmedLine.slice(2)}</span>
              </div>
            )
          }

          // Numbered lists (lines starting with number.)
          if (/^\d+\.\s/.test(trimmedLine)) {
            return (
              <div key={index} className="ml-4 mb-1">
                {trimmedLine}
              </div>
            )
          }

          // Italic disclaimers (lines starting and ending with *)
          if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')) {
            return (
              <div key={index} className="text-sm italic text-gray-600 mt-4 border-t border-gray-200 pt-3">
                {trimmedLine.slice(1, -1)}
              </div>
            )
          }

          // Regular paragraphs
          return (
            <div key={index} className="mb-2">
              {trimmedLine}
            </div>
          )
        })}
        
        {/* Upgrade button for upgrade prompts */}
        {metadata?.isUpgradePrompt && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button 
              onClick={() => navigate('/upgrade')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-black" />
          <h1 className="text-xl font-semibold text-black">EezLegal</h1>
        </div>
        {!isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/upgrade')}
              className="rounded-full"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAuthModal(true)}
              className="rounded-full"
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            {!stripeService.hasActiveSubscription(subscriptionStatus) && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/upgrade')}
                className="rounded-full text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            )}
            <span className="text-sm text-gray-600">
              Welcome, {user?.name || user?.email}
              {subscriptionStatus && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {stripeService.getSubscriptionDisplayName(subscriptionStatus.plan)}
                </span>
              )}
            </span>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Landing Page */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-black mb-4">EezLegal</h1>
              <p className="text-gray-600 text-lg mb-8">
                Your AI legal assistant for plain-English legal help
              </p>
            </div>

            <div className="w-full max-w-2xl">
              <div className="relative">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tell us your legal problem..."
                  className="w-full min-h-[60px] pr-12 resize-none rounded-2xl border-2 border-gray-200 focus:border-blue-500 text-base"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 bottom-2 rounded-full w-8 h-8 p-0 bg-black hover:bg-gray-800"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="rounded-full">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-50 text-gray-900'
                    }`}>
                      <MessageContent content={msg.content} role={msg.role} metadata={msg.metadata} />
                      {msg.metadata?.isFromAPI === false && !msg.metadata?.isUpgradePrompt && (
                        <div className="text-xs text-gray-500 mt-2 opacity-75">
                          Fallback response - API unavailable
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full min-h-[60px] pr-12 resize-none rounded-2xl border-2 border-gray-200 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="absolute right-2 bottom-2 rounded-full w-8 h-8 p-0 bg-black hover:bg-gray-800"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode="login"
      />

      {/* Welcome Back Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Welcome Back</DialogTitle>
            <p className="text-center text-gray-600 mt-2">
              Log in or sign up to get smarter responses, upload files and images, and more.
            </p>
          </DialogHeader>
          
          <div className="space-y-3 mt-6">
            <Button 
              className="w-full h-12 bg-black hover:bg-gray-800"
              onClick={() => {
                setShowWelcomeModal(false)
                setShowAuthModal(true)
              }}
            >
              Log In
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-12"
              onClick={() => {
                setShowWelcomeModal(false)
                setShowAuthModal(true)
              }}
            >
              Sign up for free
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-gray-500"
              onClick={() => setShowWelcomeModal(false)}
            >
              Stay logged out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Routes>
      <Route path="/" element={<ChatInterface />} />
      <Route 
        path="/upgrade" 
        element={<UpgradePage onBack={() => navigate('/')} />} 
      />
      <Route 
        path="/success" 
        element={<SuccessPage onContinue={() => navigate('/')} />} 
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
