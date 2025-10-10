import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Check, Crown, Zap, Building, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import stripeService from '../services/stripeService'

const UpgradePage = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const { user, isLoggedIn } = useAuth()

  const pricingPlans = stripeService.getPricingPlans()

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

  const handleUpgrade = async (planKey) => {
    if (!isLoggedIn) {
      // Show login modal or redirect to login
      alert('Please log in to upgrade your plan')
      return
    }

    const plan = pricingPlans[planKey]
    if (!plan.priceId) return

    setIsLoading(true)
    setSelectedPlan(planKey)

    try {
      const result = await stripeService.createSubscription(
        plan.priceId,
        user.id,
        user.email
      )

      if (!result.success) {
        throw new Error(result.error)
      }

      // Stripe will handle the redirect to checkout
    } catch (error) {
      console.error('Error upgrading plan:', error)
      alert('Failed to start upgrade process. Please try again.')
    } finally {
      setIsLoading(false)
      setSelectedPlan(null)
    }
  }

  const PlanIcon = ({ planKey }) => {
    switch (planKey) {
      case 'free':
        return <Zap className="w-6 h-6" />
      case 'pro':
        return <Crown className="w-6 h-6" />
      case 'business':
        return <Building className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  const isCurrentPlan = (planKey) => {
    if (!subscriptionStatus) return planKey === 'free'
    return subscriptionStatus.plan === planKey
  }

  const getCurrentPlanStatus = () => {
    if (!subscriptionStatus) return 'free'
    return subscriptionStatus.plan
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Upgrade Your Plan</h1>
              <p className="text-gray-600">Choose the plan that works best for you</p>
            </div>
          </div>
          {isLoggedIn && (
            <div className="text-sm text-gray-600">
              Current plan: <span className="font-medium">{stripeService.getSubscriptionDisplayName(getCurrentPlanStatus())}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(pricingPlans).map(([planKey, plan]) => (
            <Card 
              key={planKey} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'} ${
                isCurrentPlan(planKey) ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    planKey === 'free' ? 'bg-gray-100' :
                    planKey === 'pro' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <PlanIcon planKey={planKey} />
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {stripeService.formatPrice(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 ml-1">/month</span>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {planKey === 'free' && 'Perfect for getting started'}
                  {planKey === 'pro' && 'Best for individuals and freelancers'}
                  {planKey === 'business' && 'Ideal for teams and businesses'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                {isCurrentPlan(planKey) ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(planKey)}
                    disabled={isLoading || planKey === 'free'}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {isLoading && selectedPlan === planKey ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : planKey === 'free' ? (
                      'Current Plan'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.</p>
            </div>
            
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards (Visa, MasterCard, American Express) and PayPal through our secure Stripe payment processor.</p>
            </div>
            
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold mb-2">Is my legal information secure?</h3>
              <p className="text-gray-600">Absolutely. We use enterprise-grade encryption and security measures to protect your data. We never share your information with third parties.</p>
            </div>
            
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Need Help Choosing?</h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <Button variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradePage
