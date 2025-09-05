# EezLegal - AI Legal Assistant

A ChatGPT-style AI legal assistant built with Flask and OpenAI API.

## Features

- Clean, modern interface inspired by ChatGPT
- Light theme with professional legal branding
- Real-time chat with AI legal assistant
- Responsive design for desktop and mobile
- OpenAI GPT-3.5-turbo integration for legal guidance

## Environment Variables

Set the following environment variable in Railway:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Local Development

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Set environment variable: `export OPENAI_API_KEY=your_key_here`
6. Run the app: `python src/main.py`
7. Open http://localhost:5000

## Deployment

This app is configured for Railway deployment:

1. Connect your GitHub repository to Railway
2. Set the `OPENAI_API_KEY` environment variable in Railway dashboard
3. Railway will automatically detect the Flask app and deploy it

## API Endpoints

- `GET /` - Serves the main application
- `POST /api/chat` - Chat with the AI assistant
- `GET /api/health` - Health check endpoint

## Tech Stack

- **Backend**: Flask, OpenAI API
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: SQLite (for future user management)
- **Deployment**: Railway

## Legal Disclaimer

This AI assistant provides general legal information only and should not be considered as legal advice. Users should consult with qualified attorneys for specific legal matters.

