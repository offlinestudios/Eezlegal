# EezLegal Deployment Guide

This guide covers deploying EezLegal to production environments.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended)
- ✅ Built-in PostgreSQL
- ✅ Automatic deployments
- ✅ Environment variables UI
- ✅ Free tier available

### Option 2: Vercel + External DB
- ✅ Optimized for Next.js
- ✅ Global CDN
- ✅ Automatic scaling
- ✅ Free tier available

### Option 3: Self-hosted
- ✅ Full control
- ✅ Custom infrastructure
- ✅ Cost optimization
- ❌ More setup required

## 🛤 Railway Deployment (Recommended)

### Step 1: Prepare Repository
```bash
# Clone your repository
git clone <your-repo-url>
cd eezlegal-nextjs

# Ensure all dependencies are listed
npm install
```

### Step 2: Railway Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL service
railway add postgresql
```

### Step 3: Environment Variables
Set these in Railway dashboard or via CLI:

```bash
# Core App
railway variables set APP_URL=https://your-app.railway.app
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)

# OpenAI
railway variables set OPENAI_API_KEY=sk-your-key-here

# Stripe
railway variables set STRIPE_SECRET_KEY=sk_live_your-key
railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_your-key
railway variables set STRIPE_WEBHOOK_SECRET=whsec_your-secret
railway variables set STRIPE_PRICE_PLUS=price_your-plus-id
railway variables set STRIPE_PRICE_PRO=price_your-pro-id
```

### Step 4: Database Setup
```bash
# Generate Prisma client
railway run npx prisma generate

# Push database schema
railway run npx prisma db push
```

### Step 5: Deploy
```bash
# Deploy to Railway
railway up
```

### Step 6: Configure Domain (Optional)
1. Go to Railway dashboard
2. Click on your service
3. Go to Settings → Domains
4. Add custom domain or use Railway subdomain

## 🔷 Vercel Deployment

### Step 1: Database Setup
Choose a PostgreSQL provider:
- **Vercel Postgres** (recommended)
- **Supabase** (free tier)
- **PlanetScale** (MySQL alternative)
- **Railway** (PostgreSQL only)

### Step 2: Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Environment Variables
Add in Vercel dashboard:
```env
DATABASE_URL=postgresql://...
APP_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PLUS=price_...
STRIPE_PRICE_PRO=price_...
```

### Step 4: Database Migration
```bash
# Install Vercel CLI
npm install -g vercel

# Login and link project
vercel login
vercel link

# Run database migration
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

### Step 5: Deploy
```bash
# Deploy to Vercel
vercel --prod
```

## 🔧 Post-Deployment Configuration

### Stripe Webhook Setup
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to environment variables

### Stripe Customer Portal
1. Go to Stripe Dashboard → Customer Portal
2. Enable customer portal
3. Set return URL: `https://your-domain.com/chat`
4. Configure allowed actions:
   - Update payment method
   - Download invoices
   - Cancel subscription

### OpenAI API Setup
1. Ensure API key has sufficient credits
2. Monitor usage in OpenAI dashboard
3. Set up billing alerts
4. Consider rate limiting for production

### Domain & SSL
- **Railway**: Automatic SSL with custom domains
- **Vercel**: Automatic SSL for all domains
- **Self-hosted**: Configure SSL certificates

## 📊 Monitoring & Analytics

### Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
```

### Analytics
```bash
# Vercel Analytics
npm install @vercel/analytics

# Google Analytics
npm install gtag
```

### Performance Monitoring
- Vercel Speed Insights
- Railway metrics
- Custom monitoring with DataDog/New Relic

## 🔐 Security Checklist

### Environment Variables
- [ ] All secrets in environment variables
- [ ] No hardcoded API keys
- [ ] Secure random NEXTAUTH_SECRET
- [ ] Production Stripe keys

### Database Security
- [ ] Database connection over SSL
- [ ] Restricted database access
- [ ] Regular backups configured
- [ ] Connection pooling enabled

### Application Security
- [ ] HTTPS enforced
- [ ] Secure cookie settings
- [ ] CORS properly configured
- [ ] Rate limiting implemented

### Stripe Security
- [ ] Webhook signature verification
- [ ] Production API keys
- [ ] Customer portal configured
- [ ] Webhook endpoint secured

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

#### Database Connection Issues
```bash
# Test database connection
npx prisma db push

# Check connection string format
echo $DATABASE_URL

# Verify database accessibility
psql $DATABASE_URL -c "SELECT 1;"
```

#### Environment Variable Issues
```bash
# List all environment variables
railway variables

# Test specific variable
railway run echo $OPENAI_API_KEY
```

#### Stripe Webhook Issues
1. Check webhook endpoint URL
2. Verify webhook secret
3. Monitor webhook logs in Stripe dashboard
4. Test webhook locally with Stripe CLI

### Performance Issues

#### Slow API Responses
- Monitor OpenAI API latency
- Implement response caching
- Optimize database queries
- Add connection pooling

#### High Memory Usage
- Monitor Next.js bundle size
- Optimize images and assets
- Implement code splitting
- Use server components

## 📈 Scaling Considerations

### Database Scaling
- Connection pooling (PgBouncer)
- Read replicas for analytics
- Database indexing optimization
- Query performance monitoring

### Application Scaling
- Horizontal scaling with load balancers
- CDN for static assets
- Edge functions for global performance
- Caching strategies (Redis)

### Cost Optimization
- Monitor OpenAI API usage
- Implement rate limiting
- Optimize database queries
- Use appropriate instance sizes

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Railway
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: railway/cli@v2
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Deployment Checklist
- [ ] Tests passing
- [ ] Build successful
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Stripe webhooks configured
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Monitoring enabled

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review deployment logs
3. Test locally with production environment variables
4. Contact support with specific error messages

---

**Happy Deploying!** 🚀

