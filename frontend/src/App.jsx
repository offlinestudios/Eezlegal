import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">
            🎉 EezLegal is Live!
          </h1>
          <p className="text-xl mb-8">
            Your AI Legal Assistant is now successfully deployed on Vercel!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">✅ Deployment Status: SUCCESS</h2>
            <div className="space-y-2 text-lg">
              <p>✅ React Application: Working</p>
              <p>✅ Vercel Configuration: Fixed</p>
              <p>✅ Build Process: Complete</p>
              <p>✅ Fresh Template: Deployed</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => setMessage('EezLegal deployment successful!')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Test React Functionality
            </Button>
            
            {message && (
              <p className="text-xl font-semibold bg-green-500/20 rounded-lg p-4 inline-block">
                {message}
              </p>
            )}
          </div>
          
          <p className="mt-8 text-lg">
            The EezLegal AI Legal Assistant is ready for development!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
