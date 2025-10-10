import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const [authMode, setAuthMode] = useState(mode) // 'login', 'signup', 'phone', 'email'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [phoneStep, setPhoneStep] = useState('phone') // 'phone' or 'verify'

  const { signInWithGoogle, signInWithMicrosoft, signInWithApple, signInWithPhone, signInWithEmail, signUp } = useAuth()

  const handleOAuthSignIn = async (provider) => {
    setIsLoading(true)
    setError('')
    
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle()
          break
        case 'microsoft':
          await signInWithMicrosoft()
          break
        case 'apple':
          await signInWithApple()
          break
      }
      onClose()
    } catch (error) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let result
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters long')
          return
        }
        result = await signUp(email, password, name)
      } else {
        result = await signInWithEmail(email, password)
      }

      if (result.success) {
        onClose()
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch (error) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneAuth = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (phoneStep === 'phone') {
        // Send verification code
        const response = await fetch('/api/auth/phone/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber })
        })
        
        const data = await response.json()
        if (data.success) {
          setPhoneStep('verify')
        } else {
          setError(data.error || 'Failed to send verification code')
        }
      } else {
        // Verify code and sign in
        const result = await signInWithPhone(phoneNumber, verificationCode)
        if (result.success) {
          onClose()
        } else {
          setError(result.error || 'Verification failed')
        }
      }
    } catch (error) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setPhoneNumber('')
    setVerificationCode('')
    setError('')
    setPhoneStep('phone')
  }

  const switchMode = (newMode) => {
    setAuthMode(newMode)
    resetForm()
  }

  const renderEmailForm = () => (
    <form onSubmit={handleEmailAuth} className="space-y-4">
      {authMode === 'signup' && (
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-12"
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {authMode === 'signup' && (
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12"
          />
        </div>
      )}
      
      <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800" disabled={isLoading}>
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {authMode === 'signup' ? 'Create Account' : 'Sign In'}
      </Button>
      
      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={() => switchMode(authMode === 'signup' ? 'login' : 'signup')}
        >
          {authMode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </Button>
      </div>
    </form>
  )

  const renderPhoneForm = () => (
    <form onSubmit={handlePhoneAuth} className="space-y-4">
      {phoneStep === 'phone' ? (
        <>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
              className="h-12"
            />
          </div>
          <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Send Verification Code
          </Button>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              required
              className="h-12"
            />
            <p className="text-sm text-gray-600 mt-1">
              Code sent to {phoneNumber}
            </p>
          </div>
          <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Verify & Sign In
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPhoneStep('phone')}
            className="w-full"
          >
            Change Phone Number
          </Button>
        </>
      )}
    </form>
  )

  const getTitle = () => {
    if (authMode === 'phone') return 'Sign in with phone'
    if (authMode === 'email') return 'Sign in with email'
    if (authMode === 'signup') return 'Create your account'
    return 'Login or sign up'
  }

  const getSubtitle = () => {
    if (authMode === 'phone' || authMode === 'email' || authMode === 'signup') {
      return 'Get smarter responses and upload files, images, and more.'
    }
    return "You'll get smarter responses and can upload files, images, and more."
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{getTitle()}</DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            {getSubtitle()}
          </p>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {authMode === 'login' && (
          <div className="space-y-3 mt-6">
            <Button 
              variant="outline" 
              className="w-full justify-start space-x-3 h-12"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start space-x-3 h-12"
              onClick={() => handleOAuthSignIn('microsoft')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                <path fill="#ffb900" d="M13 13h10v10H13z"/>
              </svg>
              <span>Continue with Microsoft</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start space-x-3 h-12"
              onClick={() => handleOAuthSignIn('apple')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Continue with Apple</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start space-x-3 h-12"
              onClick={() => switchMode('phone')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>Continue with phone</span>
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>
            
            <Button 
              variant="outline"
              className="w-full h-12"
              onClick={() => switchMode('email')}
              disabled={isLoading}
            >
              Continue with email
            </Button>
          </div>
        )}

        {(authMode === 'email' || authMode === 'signup') && (
          <div className="mt-6">
            {renderEmailForm()}
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => switchMode('login')}
              >
                ← Back to all options
              </Button>
            </div>
          </div>
        )}

        {authMode === 'phone' && (
          <div className="mt-6">
            {renderPhoneForm()}
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => switchMode('login')}
              >
                ← Back to all options
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
