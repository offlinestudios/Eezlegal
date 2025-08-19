'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PLAN_PRICES } from '@/lib/stripe'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  reason?: 'fileUpload' | 'quota' | 'general'
}

export function UpgradeModal({ open, onClose, reason }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: 'PLUS' | 'PRO') => {
    setLoading(plan)
    
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  if (!open) return null

  const getTitle = () => {
    switch (reason) {
      case 'fileUpload':
        return 'Unlock File Uploads'
      case 'quota':
        return 'Upgrade for Unlimited Messages'
      default:
        return 'Upgrade to EezLegal Plus'
    }
  }

  const getDescription = () => {
    switch (reason) {
      case 'fileUpload':
        return 'Upload and analyze legal documents with EezLegal Plus'
      case 'quota':
        return 'You\'ve reached your daily message limit. Upgrade for unlimited access.'
      default:
        return 'Get unlimited access to all EezLegal features'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{getTitle()}</h2>
              <p className="text-muted-foreground mt-1">{getDescription()}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plus Plan */}
            <div className="border rounded-lg p-6 relative">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Plus</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${PLAN_PRICES.PLUS}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Perfect for individuals</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Unlimited messages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Document upload & analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">All legal modes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Chat history</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>

              <Button 
                className="w-full" 
                onClick={() => handleUpgrade('PLUS')}
                disabled={loading === 'PLUS'}
              >
                {loading === 'PLUS' ? 'Loading...' : 'Upgrade to Plus'}
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="border rounded-lg p-6 relative border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Pro</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${PLAN_PRICES.PRO}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">For businesses & teams</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Everything in Plus</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced AI models</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Bulk document processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">White-label options</span>
                </li>
              </ul>

              <Button 
                className="w-full" 
                onClick={() => handleUpgrade('PRO')}
                disabled={loading === 'PRO'}
              >
                {loading === 'PRO' ? 'Loading...' : 'Upgrade to Pro'}
              </Button>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Cancel anytime. No hidden fees. 30-day money-back guarantee.
          </div>
        </div>
      </div>
    </div>
  )
}

