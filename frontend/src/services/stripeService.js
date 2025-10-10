import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  process.env.STRIPE_PUBLISHABLE_KEY ||
  'pk_test_your_stripe_publishable_key_here'
)

export class StripeService {
  constructor() {
    this.stripe = null
    this.initialized = false
  }

  async initialize() {
    if (!this.initialized) {
      this.stripe = await stripePromise
      this.initialized = true
    }
    return this.stripe
  }

  async createCheckoutSession(priceId, userId, userEmail) {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('eezlegal_token')}`
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/upgrade`
        })
      })

      const session = await response.json()
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session')
      }

      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  async redirectToCheckout(sessionId) {
    try {
      const stripe = await this.initialize()
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      throw error
    }
  }

  async createSubscription(priceId, userId, userEmail) {
    try {
      // Create checkout session
      const session = await this.createCheckoutSession(priceId, userId, userEmail)
      
      // Redirect to Stripe Checkout
      await this.redirectToCheckout(session.id)
      
      return { success: true, sessionId: session.id }
    } catch (error) {
      console.error('Error creating subscription:', error)
      return { success: false, error: error.message }
    }
  }

  async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`/api/stripe/subscription-status/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('eezlegal_token')}`
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get subscription status')
      }

      return data
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return { success: false, error: error.message }
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('eezlegal_token')}`
        },
        body: JSON.stringify({ subscriptionId })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription')
      }

      return data
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return { success: false, error: error.message }
    }
  }

  async updatePaymentMethod(subscriptionId) {
    try {
      const response = await fetch('/api/stripe/update-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('eezlegal_token')}`
        },
        body: JSON.stringify({ subscriptionId })
      })

      const session = await response.json()
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create update session')
      }

      // Redirect to Stripe Customer Portal
      window.location.href = session.url
      
      return { success: true }
    } catch (error) {
      console.error('Error updating payment method:', error)
      return { success: false, error: error.message }
    }
  }

  // Pricing plans configuration
  getPricingPlans() {
    return {
      free: {
        name: 'Free',
        price: 0,
        priceId: null,
        features: [
          '5 questions per month',
          'Basic legal explanations',
          'General document review',
          'Email support'
        ],
        limitations: [
          'Limited monthly usage',
          'No document upload',
          'No priority support'
        ]
      },
      pro: {
        name: 'Pro',
        price: 29,
        priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
        features: [
          'Unlimited questions',
          'Advanced legal analysis',
          'Document upload & review',
          'Contract drafting templates',
          'Priority support',
          'Conversation history'
        ],
        popular: true
      },
      business: {
        name: 'Business',
        price: 99,
        priceId: 'price_business_monthly', // Replace with actual Stripe price ID
        features: [
          'Everything in Pro',
          'Team collaboration',
          'Custom templates',
          'API access',
          'Dedicated support',
          'Advanced analytics'
        ]
      }
    }
  }

  // Format price for display
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Check if user has active subscription
  hasActiveSubscription(subscriptionData) {
    return subscriptionData && 
           subscriptionData.status === 'active' && 
           subscriptionData.plan !== 'free'
  }

  // Get subscription display name
  getSubscriptionDisplayName(plan) {
    const plans = this.getPricingPlans()
    return plans[plan]?.name || 'Unknown Plan'
  }
}

export default new StripeService()
