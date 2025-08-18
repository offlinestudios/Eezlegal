# EezLegal – Full Repo (Styled UI + Flask API)

This repo contains everything you need to deploy on Railway.

## Structure
- `eezlegal-backend/src/static/`  ← **Frontend (UI)**
  - `index.html`, `styles.css`, `script.js`
- `eezlegal-backend/src/`         ← **Backend (API)**
  - `main.py` (Flask app, serves static UI and registers routes)
  - `routes/` (API endpoints: `chat.py`, `health.py`, `files.py`, `user.py`)
  - `models/` (DB models)
- `eezlegal-backend/requirements.txt`, `Procfile`, `railway.json`, `runtime.txt`, `.env.example`

## Railway variables
- **OPENAI_API_KEY** = `sk-...` (no quotes)
- *(optional)* **OPENAI_MODEL** = `gpt-4o-mini`
- *(optional)* **DATABASE_URL** (if omitted, sqlite is used so the app still boots)

## Endpoints
- `GET /api/health`  → health JSON
- `GET /api/status`  → shows `has_openai_key` and `model`
- `POST /api/chat` with `{ "message": "..." }`
- `POST /api/chat/stream` for streaming (SSE)

## Local run
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r eezlegal-backend/requirements.txt
export OPENAI_API_KEY=sk-...  # or copy .env.example to .env and fill it
python eezlegal-backend/src/main.py
# open http://localhost:5000
```
