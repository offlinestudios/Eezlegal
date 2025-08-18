# EezLegal Deployment Guide

This guide covers deploying EezLegal to Railway and other platforms.

## 🚀 Railway Deployment (Recommended)

Railway provides the easiest deployment experience for EezLegal.

### Step 1: Prepare Your Repository

1. **Initialize Git Repository**
```bash
git init
git add .
git commit -m "Initial commit: EezLegal AI Legal Assistant"
```

2. **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/eezlegal.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your EezLegal repository

3. **Configure Environment Variables**
   - Go to your project dashboard
   - Click "Variables" tab
   - Add: `OPENAI_API_KEY` = `your_openai_api_key_here`

4. **Deploy**
   - Railway automatically detects the Flask app
   - Deployment starts immediately
   - Your app will be available at a Railway URL

### Step 3: Verify Deployment

1. **Check Health Endpoint**
   - Visit: `https://your-app.railway.app/api/health`
   - Should return: `{"status": "healthy", "service": "EezLegal API", "version": "1.0.0"}`

2. **Test Frontend**
   - Visit: `https://your-app.railway.app`
   - Should load the EezLegal interface

3. **Test Chat Functionality**
   - Click on any legal mode
   - Send a test message
   - Verify AI responses work

## 🔧 Alternative Deployment Options

### Heroku

1. **Install Heroku CLI**
2. **Create Heroku App**
```bash
heroku create eezlegal-app
```

3. **Set Environment Variables**
```bash
heroku config:set OPENAI_API_KEY=your_openai_api_key_here
```

4. **Deploy**
```bash
git push heroku main
```

### DigitalOcean App Platform

1. **Create App**
   - Connect GitHub repository
   - Select Flask as framework

2. **Configure Environment**
   - Add `OPENAI_API_KEY` environment variable
   - Set build command: `pip install -r requirements.txt`
   - Set run command: `python src/main.py`

3. **Deploy**
   - App Platform handles the rest

### AWS Elastic Beanstalk

1. **Install EB CLI**
2. **Initialize Application**
```bash
eb init eezlegal
```

3. **Create Environment**
```bash
eb create eezlegal-prod
```

4. **Set Environment Variables**
```bash
eb setenv OPENAI_API_KEY=your_openai_api_key_here
```

5. **Deploy**
```bash
eb deploy
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for ChatGPT integration | `sk-...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port for the Flask app | `5000` |
| `SECRET_KEY` | Flask secret key | Auto-generated |
| `FLASK_ENV` | Flask environment | `production` |

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- **URL**: `/api/health`
- **Method**: GET
- **Response**: JSON with status information

### Monitoring Setup

1. **Railway Monitoring**
   - Built-in metrics and logs
   - Automatic health checks
   - Performance monitoring

2. **Custom Monitoring**
   - Set up external monitoring (Pingdom, UptimeRobot)
   - Monitor `/api/health` endpoint
   - Set up alerts for downtime

## 🚨 Troubleshooting

### Common Issues

1. **OpenAI API Key Not Set**
   - Error: "OpenAI API key not found"
   - Solution: Set `OPENAI_API_KEY` environment variable

2. **Frontend Not Loading**
   - Error: "index.html not found"
   - Solution: Ensure frontend is built and copied to `src/static/`

3. **CORS Issues**
   - Error: "CORS policy blocked"
   - Solution: CORS is enabled for all origins in `main.py`

4. **File Upload Issues**
   - Error: "File too large" or "File type not supported"
   - Solution: Check file size (<16MB) and type (PDF, DOCX, TXT)

### Debug Mode

For local debugging, set `debug=True` in `main.py`:
```python
app.run(host='0.0.0.0', port=port, debug=True)
```

### Logs

Check application logs:
- **Railway**: View logs in Railway dashboard
- **Heroku**: `heroku logs --tail`
- **Local**: Console output

## 🔄 Updates & Maintenance

### Updating the Application

1. **Make Changes**
   - Update code locally
   - Test thoroughly

2. **Deploy Updates**
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

3. **Verify Deployment**
   - Check health endpoint
   - Test functionality
   - Monitor for errors

### Database Migrations

If you modify database models:
1. Update models in `src/models/`
2. Database will auto-migrate on restart
3. For production, consider proper migration scripts

## 📈 Scaling

### Horizontal Scaling
- Railway: Automatic scaling based on traffic
- Heroku: Add more dynos
- AWS: Auto Scaling Groups

### Performance Optimization
- Enable caching for static files
- Optimize database queries
- Use CDN for assets
- Monitor response times

## 🔒 Security Considerations

### Production Security
- Use strong `SECRET_KEY`
- Enable HTTPS (automatic on Railway)
- Validate all user inputs
- Monitor for suspicious activity

### API Security
- Protect OpenAI API key
- Implement rate limiting
- Monitor API usage
- Set up alerts for unusual activity

---

**Need help?** Check the main README.md or contact the development team.

