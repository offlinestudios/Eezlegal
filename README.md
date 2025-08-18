# EezLegal – ONE PACKAGE (Styled UI + Flask API)

Everything you need to deploy on Railway in a single repo.

## Structure
- `eezlegal-backend/src/static/`  ← **Frontend (UI)**
  - `index.html`, `styles.css`, `script.js`
- `eezlegal-backend/src/`         ← **Backend (API)**
  - `main.py`, `routes/`, `models/`

Root-level files exist so Railway detects & runs Python:
- `requirements.txt` (includes backend requirements)
- `Procfile` (points to backend start command)
- `railway.json`
- `runtime.txt`

## Railway variables (Project or Service)
- **OPENAI_API_KEY** = `sk-...` (no quotes)
- *(optional)* **OPENAI_MODEL** = `gpt-4o-mini`

## Endpoints
- `GET /api/health`
- `GET /api/status`
- `POST /api/chat`  body: `{ "message": "..." }`
- `POST /api/chat/stream`

## Local run
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=sk-...
python eezlegal-backend/src/main.py
# open http://localhost:5000
```
