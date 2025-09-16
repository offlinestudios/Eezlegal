# EezLegal - Next.js AI Legal Assistant

A ChatGPT-style AI legal assistant built with Next.js, NextAuth, and Prisma.

## 🚀 Features

- **ChatGPT-style UI** with sidebar navigation and conversation management
- **Google OAuth authentication** with NextAuth.js
- **Protected /app routes** with middleware-based authentication
- **Conversation management** with persistent chat history
- **Responsive design** optimized for desktop and mobile
- **Railway deployment ready** with PostgreSQL database

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Authentication:** NextAuth.js with Google OAuth
- **Database:** PostgreSQL with Prisma ORM
- **Deployment:** Railway
- **Icons:** Lucide React

## 📁 Project Structure

```
eezlegal-nextjs/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   └── conversations/          # Conversation API routes
│   ├── app/                        # Protected app area
│   │   ├── page.tsx               # Main chat interface
│   │   └── c/[id]/                # Individual conversations
│   ├── login/                      # Login page
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/
│   └── AuthProvider.tsx           # NextAuth session provider
├── lib/
│   └── prisma.ts                  # Prisma client configuration
├── prisma/
│   └── schema.prisma              # Database schema
└── middleware.ts                   # Route protection middleware
```

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd eezlegal-nextjs
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Credentials** → **OAuth 2.0 Client IDs**
3. Add these redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🌐 Railway Deployment

### 1. Database Setup

1. Create a new Railway project
2. Add a **PostgreSQL** service
3. Copy the `DATABASE_URL` from Railway dashboard

### 2. Environment Variables

In Railway dashboard, go to **Variables** and add:

```
NEXTAUTH_URL=https://your-domain.railway.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
DATABASE_URL=postgresql://... (from Railway PostgreSQL service)
```

### 3. Deploy

1. Connect your GitHub repository to Railway
2. Railway will automatically build and deploy
3. Update Google OAuth redirect URIs with your Railway domain

## 📱 Usage

### Landing Page (`/`)
- Clean ChatGPT-style interface
- Login/signup buttons
- Redirects to `/app` for authenticated users who click "Open App"

### Login Page (`/login`)
- Google OAuth authentication
- Supports `?next=` parameter for redirects
- ChatGPT-style design with multiple OAuth options (placeholders)

### Protected App (`/app`)
- Full ChatGPT-style interface with sidebar
- Conversation management
- New chat creation
- Account settings and logout

### Individual Conversations (`/app/c/[id]`)
- Real-time chat interface
- Message history
- Typing indicators
- File upload placeholder

## 🔒 Security Features

- **Middleware protection** for `/app` routes
- **Session-based authentication** with NextAuth
- **CSRF protection** built into NextAuth
- **Environment variable protection** with `.gitignore`

## 🎨 Design Features

- **ChatGPT-inspired UI** with exact color scheme and spacing
- **Responsive sidebar** (collapsible on mobile)
- **Smooth animations** and transitions
- **Custom scrollbars** matching ChatGPT style
- **Loading states** and skeleton screens

## 🔧 API Routes

### Conversations
- `GET /api/conversations` - List user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get conversation with messages

### Messages
- `POST /api/conversations/[id]/messages` - Send message to conversation

## 🚧 Future Enhancements

- **OpenAI API integration** for actual AI responses
- **File upload functionality** for document analysis
- **Real-time messaging** with WebSockets
- **Conversation search** and filtering
- **Export conversations** to PDF/text
- **Custom AI models** and settings

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Verify `DATABASE_URL` is correct
   - Run `npm run db:push` to sync schema

2. **OAuth not working**
   - Check redirect URIs in Google Console
   - Verify `NEXTAUTH_URL` matches your domain

3. **Build errors**
   - Run `npm run db:generate` before building
   - Check all environment variables are set

### Development Tips

- Use `npm run db:studio` to view database in Prisma Studio
- Check browser console for client-side errors
- Use Railway logs for server-side debugging

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for legal professionals**

