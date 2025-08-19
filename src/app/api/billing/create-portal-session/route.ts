import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getAuthContext } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthContext()
    
    if (!authContext.user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: authContext.user.stripeCustomerId,
      return_url: `${process.env.APP_URL}/chat`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

