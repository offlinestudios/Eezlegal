# EezLegal - A Lawyer in Every Hand

A production-ready ChatGPT-style legal AI assistant built with Next.js, featuring authentication, billing, and comprehensive accessibility support.

## 🚀 Features

### Core Functionality
- **ChatGPT-style Interface** - Centered chat layout with immediate typing support
- **4 Legal Modes** - Plain English, Document Generator, Dispute Resolution, Deal Advisor
- **Real-time AI Responses** - Powered by OpenAI GPT models
- **Conversation History** - Persistent chat storage and management

### Authentication & User Management
- **Passwordless Authentication** - Magic link email authentication
- **OAuth Support** - Google sign-in integration ready
- **Anonymous Sessions** - Try before signup experience
- **Automatic Migration** - Seamless conversation transfer on signup

### Billing & Subscriptions
- **Stripe Integration** - Complete subscription management
- **Multiple Plans** - Free, Plus ($12.99), Pro ($49.99)
- **Customer Portal** - Self-service billing management
- **Webhook Handling** - Automatic plan updates

### Accessibility & UX
- **WCAG 2.1 AA Compliant** - Full keyboard navigation and screen reader support
- **Responsive Design** - Works perfectly on desktop and mobile
- **Focus Management** - Proper focus traps and indicators
- **Semantic HTML** - Proper ARIA roles and labels

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Custom magic link + OAuth ready
- **Payments**: Stripe Subscriptions
- **AI**: OpenAI GPT API
- **Deployment**: Railway/Vercel ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Stripe account (for billing)

### Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd eezlegal-nextjs
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/eezlegal"
   
   # App
   APP_URL="http://localhost:3000"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OpenAI
   OPENAI_API_KEY="sk-..."
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   STRIPE_PRICE_PLUS="price_..."
   STRIPE_PRICE_PRO="price_..."
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Development**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Railway Deployment

1. **Create Railway Project**
   ```bash
   railway login
   railway init
   ```

2. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set OPENAI_API_KEY=sk-...
   railway variables set STRIPE_SECRET_KEY=sk_...
   # ... add all other variables
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Vercel Deployment

1. **Connect to Vercel**
   - Import project from GitHub
   - Add environment variables in dashboard
   - Deploy automatically

2. **Database**
   - Use Vercel Postgres or external PostgreSQL
   - Run migrations: `npx prisma db push`

## 🔧 Configuration

### Stripe Setup

1. **Create Products**
   - Plus Plan: $12.99/month
   - Pro Plan: $49.99/month

2. **Configure Webhooks**
   - Endpoint: `https://your-domain.com/api/billing/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

3. **Customer Portal**
   - Enable in Stripe Dashboard
   - Configure return URL: `https://your-domain.com/chat`

### OpenAI Setup

1. **API Key**
   - Get from platform.openai.com
   - Add credits to account ($5+ recommended)

2. **Model Configuration**
   - Default: `gpt-3.5-turbo`
   - Configurable in `/src/app/api/messages/route.ts`

## 🎯 Usage

### Anonymous Experience
- Visit homepage
- Select legal mode
- Chat with AI (10 messages/day limit)
- Upgrade prompts after 3 messages

### Authenticated Experience
- Magic link sign-in
- Full chat history
- Unlimited messages (Plus/Pro)
- File uploads (Plus/Pro)
- Settings & billing management

### Legal Modes
1. **Plain English** - Translate complex legal documents
2. **Document Generator** - Create professional legal docs
3. **Dispute Resolution** - Recover what you're owed
4. **Deal Advisor** - Get suggestions to win every deal

## 🔐 Security

- **Environment Variables** - All secrets in environment
- **HTTPS Only** - Secure cookie settings
- **Webhook Verification** - Stripe signature validation
- **SQL Injection Protection** - Prisma ORM
- **XSS Protection** - React built-in protection

## ♿ Accessibility

- **Keyboard Navigation** - Full keyboard support
- **Screen Readers** - ARIA labels and roles
- **Focus Management** - Proper focus traps
- **Color Contrast** - WCAG AA compliant
- **Semantic HTML** - Proper heading hierarchy

## 🚨 Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check API key validity
   - Ensure account has credits
   - Verify model availability

2. **Database Connection**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Run `npx prisma db push`

3. **Stripe Webhooks**
   - Verify webhook endpoint URL
   - Check webhook secret
   - Monitor webhook logs in Stripe

4. **Authentication Issues**
   - Check NEXTAUTH_SECRET is set
   - Verify APP_URL matches deployment
   - Check email delivery (magic links)

## 📄 License

MIT License - see LICENSE file for details

---

**EezLegal** - Making legal assistance accessible to everyone through AI technology.
