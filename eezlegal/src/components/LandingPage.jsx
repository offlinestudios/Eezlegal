import { useState } from 'react'
import { Button } from '@/components/ui/button'

const LandingPage = ({ onLogin, onQuestionSubmit }) => {
  const [inputValue, setInputValue] = useState('')

  const examplePrompts = [
    "What are the risks in this NDA?",
    "Explain this clause simply",
    "Help me negotiate better terms"
  ]

  const handleExampleClick = (prompt) => {
    setInputValue(prompt)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onQuestionSubmit(inputValue)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="text-xl font-medium text-gray-900">
          ezlegal
        </div>
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-gray-900"
          onClick={onLogin}
        >
          Sign in
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <div className="w-full max-w-2xl text-center">
          {/* Main Heading */}
          <h1 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-900 mb-12">
            What kind of legal problem can I help you with?
          </h1>

          {/* Input Composer */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your legal question..."
                className="w-full px-6 py-4 text-lg border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              />
              {inputValue.trim() && (
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white"
                >
                  →
                </Button>
              )}
            </div>
          </form>

          {/* Example Prompts */}
          <div className="space-y-3">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(prompt)}
                className="block w-full text-gray-400 hover:text-gray-600 transition-colors text-base bg-transparent border-none p-0"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-gray-500">
          Educational help, not a law firm.
        </p>
      </footer>
    </div>
  )
}

export default LandingPage

