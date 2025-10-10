# EezLegal Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Deploy with Manus (Recommended)

The easiest way to deploy your EezLegal application is using the built-in Manus deployment system:

```bash
# From the project directory
manus deploy
```

This will automatically:
- Build the React application
- Deploy to a public URL
- Configure environment variables
- Set up SSL certificates
- Provide you with a live URL

### Option 2: Manual Deployment

#### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd eezlegal-app
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   ```
   VITE_BACKEND_URL=https://your-backend-api.com
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   ```

#### Railway Deployment

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Configure Environment Variables:**
   ```bash
   railway variables set VITE_BACKEND_URL=https://your-backend-api.com
   railway variables set VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   ```

## 🔧 Environment Variables Setup

### Required Variables

```env
# Backend API URL
VITE_BACKEND_URL=https://your-backend-api.com

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Optional: OpenAI API Key (if not handled by backend)
VITE_OPENAI_API_KEY=sk-your_openai_api_key
```

### Development vs Production

**Development (.env.local):**
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
```

**Production:**
```env
VITE_BACKEND_URL=https://api.eezlegal.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

## 🏗️ Backend Deployment Requirements

Your backend must be deployed and accessible before deploying the frontend. Ensure these endpoints are available:

### Authentication Endpoints
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/verify`
- `POST /api/auth/logout`
- `GET /auth/google` (OAuth redirect)
- `GET /auth/microsoft` (OAuth redirect)
- `GET /auth/apple` (OAuth redirect)

### Chat Endpoints
- `POST /api/chat`
- `GET /api/chat/history/:userId`

### Stripe Endpoints
- `POST /api/stripe/create-checkout-session`
- `GET /api/stripe/subscription-status/:userId`
- `POST /api/stripe/cancel-subscription`
- `POST /api/stripe/webhook` (for Stripe webhooks)

### Health Check
- `GET /health`
- `GET /api/config`

## 🔐 Security Configuration

### CORS Setup
Ensure your backend allows requests from your frontend domain:

```javascript
// Backend CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5174',  // Development
    'https://your-app.vercel.app',  // Production
    'https://eezlegal.com'  // Custom domain
  ],
  credentials: true
}))
```

### Environment Security
- Never commit `.env` files to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Monitor API usage and set up alerts

## 📊 Post-Deployment Checklist

### ✅ Frontend Verification
- [ ] Application loads without errors
- [ ] All pages render correctly (/, /upgrade, /success)
- [ ] Authentication modal opens and displays OAuth options
- [ ] Chat interface responds to messages
- [ ] Upgrade page displays pricing correctly
- [ ] Responsive design works on mobile

### ✅ Backend Integration
- [ ] Health check endpoint returns success
- [ ] Authentication endpoints respond correctly
- [ ] Chat messages receive responses (or fallback)
- [ ] Stripe checkout session creation works
- [ ] OAuth redirects function properly

### ✅ Third-Party Services
- [ ] Google OAuth redirects to correct URL
- [ ] Microsoft OAuth works (if configured)
- [ ] Apple OAuth works (if configured)
- [ ] Stripe checkout completes successfully
- [ ] Success page displays after payment
- [ ] OpenAI API responses work (if configured)

### ✅ Performance & Monitoring
- [ ] Page load times are acceptable (<3 seconds)
- [ ] Images and assets load properly
- [ ] Error tracking is configured
- [ ] Analytics are working (if implemented)
- [ ] SSL certificate is valid
- [ ] CDN is configured (if using)

## 🐛 Common Deployment Issues

### Issue: "Backend service unavailable"
**Solution:**
- Check `VITE_BACKEND_URL` is correct
- Verify backend is deployed and accessible
- Check CORS configuration allows frontend domain

### Issue: Stripe checkout not working
**Solution:**
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is correct
- Check Stripe price IDs match your dashboard
- Ensure webhook endpoints are configured

### Issue: OAuth authentication fails
**Solution:**
- Check OAuth redirect URLs match deployment URL
- Verify OAuth client IDs and secrets are correct
- Ensure backend OAuth endpoints are accessible

### Issue: Build fails during deployment
**Solution:**
- Check all required dependencies are in `package.json`
- Verify environment variables are set before build
- Clear cache and rebuild: `rm -rf node_modules && pnpm install`

## 📈 Scaling Considerations

### Performance Optimization
- Enable gzip compression
- Configure CDN for static assets
- Implement service worker for caching
- Optimize images and bundle size

### Monitoring & Analytics
- Set up error tracking (Sentry, LogRocket)
- Configure performance monitoring
- Implement user analytics
- Monitor API usage and costs

### Security Hardening
- Implement Content Security Policy (CSP)
- Enable HSTS headers
- Regular security audits
- Monitor for vulnerabilities

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy EezLegal
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
      - run: pnpm install
      - run: pnpm build
        env:
          VITE_BACKEND_URL: ${{ secrets.BACKEND_URL }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_KEY }}
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

## 📞 Support

If you encounter issues during deployment:

1. **Check the logs** for specific error messages
2. **Verify environment variables** are set correctly
3. **Test backend endpoints** independently
4. **Review CORS configuration** if getting network errors
5. **Contact support** at support@eezlegal.com

---

**Happy Deploying! 🚀**
