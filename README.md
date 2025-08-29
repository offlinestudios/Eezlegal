# Eezlegal - Legal AI Assistant

A complete full-stack legal AI assistant application with OpenAI integration, user authentication, document processing, and payment features.

## 🚀 Railway Deployment

### 1. Environment Variables Required

Set these in your Railway project settings:

```
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

### 2. Deployment Steps

1. **Connect Repository**: Link this repository to Railway
2. **Set Environment Variables**: Add the required API keys above
3. **Deploy**: Railway will automatically detect the Flask app and deploy

### 3. Database

- Uses SQLite by default (included)
- Automatically creates tables on first run
- For production, consider upgrading to PostgreSQL

## 🔧 Local Development

### Prerequisites
- Python 3.11+
- Virtual environment

### Setup
```bash
# Clone and navigate to project
cd eezlegal-backend

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your_key_here"
export STRIPE_SECRET_KEY="your_key_here"

# Run the application
python src/main.py
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
src/
├── main.py              # Flask application entry point
├── models/
│   └── user.py          # Database models (User, Conversation, Message, Document, Payment)
├── routes/
│   ├── user.py          # Authentication & user management
│   ├── chat.py          # AI chat functionality
│   ├── documents.py     # Document upload & analysis
│   └── payments.py      # Stripe payment processing
├── static/              # React frontend (built)
├── uploads/             # Document storage
└── database/
    └── app.db           # SQLite database
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Chat & AI
- `GET /api/conversations` - Get conversations
- `POST /api/conversations` - Create conversation
- `POST /api/conversations/{id}/messages` - Send message

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `POST /api/documents/{id}/analyze` - Analyze document

### Payments
- `GET /api/pricing` - Get pricing plans
- `POST /api/create-payment-intent` - Create payment
- `POST /api/confirm-payment` - Confirm payment

## 💰 Pricing Plans

### Free Tier
- 10 AI conversations per month
- GPT-3.5 model
- Basic features

### Premium Tier
- **Monthly**: $29.99/month
- **Yearly**: $299.99/year (save $60)
- Unlimited conversations
- GPT-4 model access
- Document analysis
- Priority support

## 🔐 Security Features

- JWT-based authentication
- Password hashing with Werkzeug
- CORS configuration
- File upload validation
- Usage tracking and limits

## 📊 Database Models

### User
- Authentication & profile data
- Subscription status
- Usage tracking

### Conversation
- Chat organization
- User-specific conversations

### Message
- Individual chat messages
- AI response metadata

### Document
- File metadata
- Analysis results

### Payment
- Stripe integration
- Subscription tracking

## 🛠️ Technologies Used

- **Backend**: Flask, SQLAlchemy, SQLite
- **AI**: OpenAI GPT-3.5/GPT-4
- **Authentication**: JWT tokens
- **Payments**: Stripe
- **Document Processing**: PyPDF2, python-docx
- **Frontend**: React, Tailwind CSS (included in static/)

## 📞 Support

For deployment issues or questions, check the Railway logs and ensure all environment variables are properly set.

