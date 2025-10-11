# EezLegal - Complete Full-Stack Application

A modern AI-powered legal assistant with React frontend and FastAPI backend, designed for professional legal consultation and document analysis.

## 🏗️ Architecture

### Frontend (Vercel Deployment)
- **Location**: `/frontend/`
- **Technology**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel
- **Live URL**: https://eezlegal.vercel.app

### Backend (Railway Deployment)
- **Location**: `/backend/`
- **Technology**: FastAPI + Python
- **Database**: PostgreSQL (Railway)
- **Deployment**: Railway
- **API Documentation**: `/docs` endpoint

## 🚀 Quick Start

### Frontend Development
```bash
cd frontend
pnpm install
pnpm dev
```

### Backend Development
```bash
cd backend
pip install -r requirements_enhanced.txt
uvicorn main_enhanced:app --reload
```

## 🔧 Deployment

### Frontend to Vercel
1. Connect your GitHub repository to Vercel
2. Set build directory to `frontend`
3. Configure environment variables:
   ```
   VITE_BACKEND_URL=https://your-railway-backend.railway.app
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   ```

### Backend to Railway
1. Connect your GitHub repository to Railway
2. Set root directory to `backend`
3. Use `main_enhanced.py` as the main file
4. Configure environment variables:
   ```
   OPENAI_API_KEY=sk-your_openai_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret
   FRONTEND_URL=https://eezlegal.vercel.app
   ```

## ✨ Features

### Frontend Features
- **Modern UI**: ChatGPT-style interface based on Figma design
- **Authentication**: Google, Microsoft, Apple OAuth + phone/email
- **AI Chat**: Enhanced responses with typing indicators
- **Payments**: Stripe integration with upgrade page
- **Responsive**: Mobile-first design with Tailwind CSS

### Backend Features
- **RESTful API**: FastAPI with automatic documentation
- **Authentication**: JWT tokens + OAuth integration
- **AI Integration**: OpenAI GPT-4 for legal assistance
- **Payment Processing**: Stripe subscriptions and billing
- **CORS**: Configured for Vercel frontend

## 📁 Project Structure

```
eezlegal/
├── frontend/                 # React application (Vercel)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API integration
│   │   ├── contexts/         # React contexts
│   │   └── App.jsx          # Main application
│   ├── package.json         # Frontend dependencies
│   ├── vercel.json          # Vercel configuration
│   └── .env.production      # Production environment
├── backend/                 # FastAPI application (Railway)
│   ├── main_enhanced.py     # Enhanced API with all endpoints
│   ├── requirements_enhanced.txt  # Python dependencies
│   ├── railway_enhanced.json     # Railway configuration
│   └── models/              # Database models
└── README.md               # This file
```

## 🔐 Environment Variables

### Frontend (.env.production)
```env
VITE_BACKEND_URL=https://your-railway-backend.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### Backend (Railway Environment)
```env
OPENAI_API_KEY=sk-your_openai_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_oauth_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_oauth_client_secret
APPLE_CLIENT_ID=your_apple_oauth_client_id
APPLE_CLIENT_SECRET=your_apple_oauth_client_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
JWT_SECRET_KEY=your_jwt_secret_key
FRONTEND_URL=https://eezlegal.vercel.app
DATABASE_URL=postgresql://user:pass@host:port/db
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Token verification
- `POST /api/auth/logout` - User logout
- `GET /auth/google` - Google OAuth
- `GET /auth/microsoft` - Microsoft OAuth
- `GET /auth/apple` - Apple OAuth

### Chat
- `POST /api/chat` - Send chat message with AI response

### Stripe
- `POST /api/stripe/create-checkout-session` - Create payment session
- `GET /api/stripe/subscription-status/{user_id}` - Get subscription status

### User Management
- `GET /api/user/{user_id}` - Get user profile
- `PUT /api/user/{user_id}` - Update user profile

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
pnpm test
```

### Backend Testing
```bash
cd backend
pytest
```

## 📊 Monitoring

- **Frontend**: Vercel Analytics + Error Tracking
- **Backend**: Railway Metrics + Logging
- **API**: FastAPI automatic documentation at `/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.eezlegal.com](https://docs.eezlegal.com)
- **Issues**: [GitHub Issues](https://github.com/offlinestudios/Eezlegal/issues)
- **Email**: support@eezlegal.com

---

**Built with ❤️ by OfflineStudios**

*Making legal help accessible, affordable, and easy to understand.*
# Trigger deployment
# Force deployment Fri Oct 10 20:49:34 EDT 2025
