import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { CheckCircle, ArrowRight, Download, MessageSquare } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const SuccessPage = ({ onContinue }) => {
  const [sessionId, setSessionId] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const session = urlParams.get('session_id')
    setSessionId(session)
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome to EezLegal Pro!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-4">
              Your subscription has been activated successfully. You now have access to all Pro features.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* What's New Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                What's included in your Pro plan:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Unlimited legal questions</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Document upload & analysis</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Advanced legal insights</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Contract drafting templates</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Conversation history</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Start Chatting</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Ask unlimited legal questions with advanced AI analysis
                  </p>
                  <Button 
                    onClick={onContinue}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Start Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <Download className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Upload Documents</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get detailed analysis of your contracts and legal documents
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={onContinue}
                  >
                    Upload Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">View Templates</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Access professional contract templates and clauses
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={onContinue}
                  >
                    Browse Templates
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Receipt Information */}
            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Payment Confirmation</h4>
                <p className="text-sm text-gray-600">
                  A receipt has been sent to <strong>{user?.email}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Session ID: {sessionId}
                </p>
              </div>
            )}

            {/* Continue Button */}
            <div className="pt-4">
              <Button 
                onClick={onContinue}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white"
              >
                Continue to EezLegal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Support */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Need help getting started?{' '}
                <a href="mailto:support@eezlegal.com" className="text-blue-500 hover:underline">
                  Contact our support team
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SuccessPage
