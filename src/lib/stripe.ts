import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const STRIPE_PRICES = {
  PLUS: process.env.STRIPE_PRICE_PLUS!,
  PRO: process.env.STRIPE_PRICE_PRO!,
}

export const PLAN_PRICES = {
  PLUS: 12.99,
  PRO: 49.99,
}

