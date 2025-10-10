# EezLegal - AI Legal Assistant

A modern, ChatGPT-style legal AI assistant built with React, featuring OAuth authentication, Stripe integration, and professional legal response formatting.

## 🚀 Features

### ✅ **Modern UI/UX**
- **ChatGPT-inspired interface** based on Figma design
- **Responsive design** with Tailwind CSS and shadcn/ui components
- **Professional typography** and clean visual hierarchy
- **Smooth animations** and micro-interactions

### ✅ **Authentication System**
- **OAuth Integration**: Google, Microsoft, Apple sign-in
- **Phone verification** with SMS codes
- **Email/password** authentication
- **Secure token management** with automatic refresh

### ✅ **AI Chat Features**
- **Typing indicators** that mirror iMessage experience
- **EezLegal response format** with structured legal advice:
  - TL;DR summaries
  - What this means explanations
  - Risks & gotchas warnings
  - Next steps action items
  - Legal disclaimers
- **Conversation history** and context awareness
- **Fallback responses** when API is unavailable

### ✅ **Stripe Integration**
- **Professional pricing page** with three tiers (Free, Pro, Business)
- **Secure checkout** with Stripe payment processing
- **Subscription management** and status tracking
- **Success page** with onboarding flow
- **Usage limits** and upgrade prompts for free users

### ✅ **Backend Integration**
- **RESTful API** connection with existing backend
- **Error handling** and graceful fallbacks
- **Real-time status** monitoring
- **Secure authentication** token management

## 🛠 Technology Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: Custom OAuth + JWT tokens
- **Payments**: Stripe.js
- **Routing**: React Router DOM

## 📦 Installation

### Prerequisites
- Node.js 18+ and pnpm
- Backend API server running
- Stripe account for payments
- OAuth provider credentials (Google, Microsoft, Apple)

### Setup Steps

1. **Clone and install dependencies:**
   ```bash
   cd eezlegal-app
   pnpm install
   ```

2. **Environment Configuration:**
   Create `.env.local` file:
   ```env
   VITE_BACKEND_URL=https://your-backend-api.com
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   VITE_OPENAI_API_KEY=sk-your_openai_key (optional, backend handles this)
   ```

3. **Development Server:**
   ```bash
   pnpm dev
   ```
   Visit `http://localhost:5174`

4. **Production Build:**
   ```bash
   pnpm build
   pnpm preview
   ```

## 🔧 Configuration

### Backend Integration
The app connects to your existing backend at `/api` endpoints:

- `POST /api/auth/login` - Email/password authentication
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Token verification
- `POST /api/chat` - Send chat messages
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `GET /api/stripe/subscription-status/:userId` - Get subscription status

### OAuth Setup
Configure OAuth providers in your backend:

1. **Google OAuth**: Set up Google Cloud Console project
2. **Microsoft OAuth**: Configure Azure AD application
3. **Apple OAuth**: Set up Apple Developer account

### Stripe Configuration
1. Create Stripe account and get publishable key
2. Set up products and pricing in Stripe Dashboard
3. Configure webhooks for subscription events
4. Update price IDs in `stripeService.js`

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard.

### Option 2: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Netlify
```bash
# Build for production
pnpm build

# Deploy dist/ folder to Netlify
```

## 📁 Project Structure

```
eezlegal-app/
├── src/
│   ├── components/          # React components
│   │   ├── AuthModal.jsx    # Authentication modal
│   │   ├── UpgradePage.jsx  # Pricing and upgrade page
│   │   └── SuccessPage.jsx  # Post-payment success page
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── services/            # API and business logic
│   │   ├── backendService.js    # Backend API integration
│   │   ├── chatService.js       # Chat message processing
│   │   ├── stripeService.js     # Stripe payment processing
│   │   └── openaiService.js     # OpenAI API integration
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── .env.local              # Environment variables
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔐 Security Features

- **JWT token authentication** with automatic refresh
- **Secure HTTP-only cookies** for session management
- **CORS protection** and request validation
- **Input sanitization** and XSS prevention
- **Stripe PCI compliance** for payment processing
- **Environment variable protection** for sensitive keys

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update components in `src/components/ui/` for design changes
- Customize colors, fonts, and spacing in CSS variables

### Response Format
- Edit `chatService.js` to modify AI response structure
- Update `formatEezLegalResponse()` for custom formatting
- Customize fallback responses and error messages

### Pricing Plans
- Update `stripeService.js` with your Stripe price IDs
- Modify `UpgradePage.jsx` for pricing display changes
- Configure usage limits and feature gates

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check `VITE_BACKEND_URL` in `.env.local`
   - Verify backend server is running
   - Check CORS configuration

2. **Stripe Checkout Not Working**
   - Verify `VITE_STRIPE_PUBLISHABLE_KEY` is correct
   - Check Stripe price IDs match your dashboard
   - Ensure webhook endpoints are configured

3. **OAuth Authentication Issues**
   - Verify OAuth client IDs and secrets
   - Check redirect URLs match configuration
   - Ensure backend OAuth endpoints are working

4. **Build Failures**
   - Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
   - Check for TypeScript errors: `pnpm type-check`
   - Verify all environment variables are set

## 📊 Analytics & Monitoring

The app includes built-in analytics for:
- **User engagement** metrics
- **Conversation topics** and intents
- **Subscription conversion** rates
- **Error tracking** and performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For technical support or questions:
- **Email**: support@eezlegal.com
- **Documentation**: [docs.eezlegal.com](https://docs.eezlegal.com)
- **Issues**: [GitHub Issues](https://github.com/eezlegal/eezlegal-app/issues)

---

**Built with ❤️ by the EezLegal Team**

*Making legal help accessible, affordable, and easy to understand.*
