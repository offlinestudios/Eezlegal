# EezLegal - AI Legal Assistant

**"A lawyer in every hand"**

EezLegal is a modern, ChatGPT-style AI legal assistant that provides instant legal guidance and document analysis. Built with React frontend and Flask backend, featuring real-time chat, document upload, and specialized legal analysis modes.

## 🚀 Features

### Core Functionality
- **ChatGPT-Style Interface**: Modern, intuitive chat interface with sidebar navigation
- **4 Legal Analysis Modes**:
  - **Plain English**: Translate complex legal documents into understandable language
  - **Document Generator**: Create professional legal documents and templates
  - **Dispute Resolution**: Get guidance on legal disputes and recovery options
  - **Deal Advisor**: Strategic advice for business negotiations and transactions

### Advanced Features
- **Document Upload**: Support for PDF, DOCX, and TXT files with text extraction
- **Real-time Chat**: Powered by OpenAI's GPT-4.1-mini model
- **Conversation History**: Persistent chat sessions with sidebar management
- **Responsive Design**: Mobile-first design that works on all devices
- **Professional Pricing**: Personal ($12.99/month) and Business ($49.99/month) plans

## 🛠 Technology Stack

### Frontend
- **React 18** with Vite build system
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **Lucide React** icons
- **Responsive design** with mobile support

### Backend
- **Flask** web framework
- **OpenAI API v1+** integration (modern SDK)
- **File processing** (PDF, DOCX, TXT)
- **CORS enabled** for frontend-backend communication
- **SQLite database** for data persistence

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd eezlegal-backend
```

2. **Set up Python environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

4. **Run the application**
```bash
python src/main.py
```

5. **Access the application**
Open http://localhost:5000 in your browser

## 🚀 Railway Deployment

### Quick Deploy
1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: EezLegal AI Legal Assistant"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy to Railway**
- Connect your GitHub repository to Railway
- Set environment variable: `OPENAI_API_KEY=your_actual_api_key`
- Railway will automatically detect and deploy the Flask application

3. **Environment Variables Required**
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Deployment Files
- `Procfile`: Defines the start command for Railway
- `runtime.txt`: Specifies Python version
- `railway.json`: Railway-specific configuration
- `requirements.txt`: Python dependencies

## 📁 Project Structure

```
eezlegal-backend/
├── src/
│   ├── routes/
│   │   ├── chat.py          # ChatGPT API integration
│   │   ├── files.py         # File upload and processing
│   │   ├── health.py        # Health check endpoint
│   │   └── user.py          # User management (template)
│   ├── models/
│   │   └── user.py          # Database models
│   ├── static/              # Built React frontend
│   │   ├── index.html
│   │   └── assets/
│   ├── database/
│   │   └── app.db           # SQLite database
│   └── main.py              # Flask application entry point
├── venv/                    # Python virtual environment
├── requirements.txt         # Python dependencies
├── Procfile                 # Railway start command
├── runtime.txt              # Python version
├── railway.json             # Railway configuration
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🔧 API Endpoints

### Chat Endpoints
- `POST /api/chat` - Send message to AI assistant
- `POST /api/chat/stream` - Streaming chat responses

### File Endpoints
- `POST /api/upload` - Upload and process documents
- `POST /api/analyze` - Analyze uploaded documents

### Health Check
- `GET /api/health` - Application health status

## 💰 Pricing Plans

### Personal - $12.99/month
- Perfect for individuals and personal legal needs
- Access to all 4 legal analysis modes
- Document upload and analysis
- Chat history and conversation management

### Business - $49.99/month
- Advanced features for businesses and teams
- Priority support
- Enhanced document processing
- Team collaboration features

## 🔒 Security & Privacy

- **Secure API Integration**: Modern OpenAI SDK with proper error handling
- **File Processing**: Secure document upload with size and type validation
- **CORS Protection**: Configured for secure frontend-backend communication
- **Environment Variables**: Sensitive data stored securely

## 🎨 Design Features

- **ChatGPT-Inspired UI**: Familiar interface for immediate user comfort
- **Professional Branding**: Clean, modern design with EezLegal logo
- **Mobile Responsive**: Optimized for all screen sizes
- **Accessibility**: Proper contrast, keyboard navigation, and screen reader support

## 🚀 Future Enhancements

- User authentication and account management
- Advanced document templates
- Integration with legal databases
- Multi-language support
- Voice input/output capabilities
- Team collaboration features

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support and questions, please contact the development team.

---

**EezLegal - Making legal assistance accessible to everyone, one chat at a time.**

