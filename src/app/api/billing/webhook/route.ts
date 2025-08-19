import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const userId = session.metadata?.userId
          const plan = session.metadata?.plan

          if (userId && plan) {
            // Update user plan
            await prisma.user.update({
              where: { id: userId },
              data: { plan: plan as 'PLUS' | 'PRO' }
            })

            // Create subscription record
            await prisma.subscription.create({
              data: {
                userId,
                stripeSubId: subscription.id,
                status: subscription.status,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000)
              }
            })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.subscription.update({
          where: { stripeSubId: subscription.id },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        })

        // Update user plan based on subscription status
        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripeSubId: subscription.id },
          include: { user: true }
        })

        if (dbSubscription) {
          const newPlan = subscription.status === 'active' 
            ? (subscription.items.data[0]?.price.id === process.env.STRIPE_PRICE_PRO ? 'PRO' : 'PLUS')
            : 'FREE'

          await prisma.user.update({
            where: { id: dbSubscription.userId },
            data: { plan: newPlan }
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Update subscription status
        await prisma.subscription.update({
          where: { stripeSubId: subscription.id },
          data: { status: 'canceled' }
        })

        // Downgrade user to free plan
        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripeSubId: subscription.id }
        })

        if (dbSubscription) {
          await prisma.user.update({
            where: { id: dbSubscription.userId },
            data: { plan: 'FREE' }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

