# CodeCraft AI

**Turn your ideas into code with AI.**

CodeCraft AI is a simple full-stack web app. You describe a programming
requirement in plain English, pick a language, and the app generates the
source code plus a beginner-friendly explanation of how it works. Every
successful generation is saved so you can revisit it later from the
History page.

## Tech stack

| Layer     | Technology                                   |
|-----------|-----------------------------------------------|
| Frontend  | React 18 + Vite, Axios, React Router          |
| Backend   | Python, Flask, REST API                       |
| Database  | SQLite                                        |
| AI        | Claude API (with a built-in demo/mock mode)   |

## Project structure

```
CodeCraft-AI/
├── frontend/                 React app (Vite)
│   ├── src/
│   │   ├── components/       Navbar, FeatureCard, CodeBox, Loader
│   │   ├── pages/             Home.jsx, Generator.jsx, History.jsx
│   │   ├── api.js             Axios calls to the Flask backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  Flask app
│   ├── app.py                 Routes: /api/generate, /api/history...
│   ├── models.py              SQLite table + queries
│   ├── services/
│   │   └── ai_service.py      The only file that talks to the AI API
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── .gitignore
```

## How it works

```
User opens the site → clicks "Start Generating" → enters a requirement
→ picks a language → clicks "Generate Code" → React calls Flask
→ Flask calls the AI service → AI returns code + explanation
→ Flask saves the result in SQLite and returns it → React displays it
→ user can copy/download the code, or revisit it later in History.
```

---

## 1. Prerequisites

Install these once, if you don't already have them:

- **Python 3.10+** — https://www.python.org/downloads/ (on the installer, tick "Add Python to PATH")
- **Node.js 18+** (includes npm) — https://nodejs.org/
- **VS Code** — https://code.visualstudio.com/

You do **not** need to install SQLite separately — Python's built-in
`sqlite3` module handles it, and the database file is created
automatically the first time you run the backend.

## 2. Get the project running

Open the `CodeCraft-AI` folder in VS Code, then open **two terminals**
(Terminal → New Terminal, then click the "+" once more) — one for the
backend, one for the frontend. The commands below use Windows syntax; on
macOS/Linux use `python3` and `source venv/bin/activate` where noted.

### 2a. Backend (Flask API) — Terminal 1

```bash
cd backend

# create and activate a virtual environment (recommended)
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# install dependencies
pip install -r requirements.txt

# create your local environment file
copy .env.example .env         # Windows
# cp .env.example .env         # macOS / Linux
```

Open the new `backend/.env` file and, if you have one, paste in your
Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
```

**Don't have a key?** Leave it blank — see [Demo mode](#4-demo-mode-no-api-key-needed) below. The app still works end to end.

Now start the backend:

```bash
python app.py
```

You should see Flask running at **http://localhost:5000**. Leave this
terminal open.

### 2b. Frontend (React) — Terminal 2

```bash
cd frontend
npm install
npm run dev
```

Vite will start the app at **http://localhost:5173**. Open that address
in your browser.

That's it — with both terminals running, the app is fully functional.

## 3. Using the app

1. **Home** — click "Start Generating".
2. **Generator** — describe what you want in the textarea (e.g. *"Create
   a Python program to calculate the average of 5 numbers"*), choose a
   language, and click **Generate Code**.
3. Read the code in the editor-style panel on the right, along with its
   plain-English explanation underneath.
4. Use **Copy** to copy the code, or **Download** to save it as a file
   (`.py`, `.java`, `.js`, etc. depending on the language).
5. **History** — every successful generation is listed here. Click one
   to view its full code and explanation again.

## 4. Demo mode (no API key needed)

If `ANTHROPIC_API_KEY` is empty in `backend/.env` (or an API call fails
for any reason), `services/ai_service.py` automatically falls back to a
demo/mock generator. It returns a small, clearly-labelled placeholder
snippet for the language you picked, so you can still test the entire
flow — the form, the loading state, saving to SQLite, history, copy, and
download — without owning an API key.

Add a real key later and restart the backend (`Ctrl+C`, then
`python app.py` again) to get real, requirement-specific code.

## 5. API reference

**POST** `/api/generate`

```json
// Request
{ "prompt": "Create a calculator", "language": "Python" }

// Response
{ "success": true, "code": "generated code", "explanation": "simple explanation" }
```

**GET** `/api/history` — list of past generations (id, prompt, language, created_at).

**GET** `/api/history/<id>` — full record for one generation.

## 6. Troubleshooting

- **"Failed to fetch" / network error in the browser** — make sure the
  Flask backend is running on port 5000 *before* you use the Generator
  page.
- **CORS error in the browser console** — confirm the frontend is
  running on `http://localhost:5173` (the default Vite port); the
  backend only allows that exact origin.
- **`ModuleNotFoundError` when running `python app.py`** — make sure
  your virtual environment is activated and you ran
  `pip install -r requirements.txt` inside `backend/`.
- **Port already in use** — change `FLASK_PORT` in `backend/.env`, or
  stop whatever else is using port 5000/5173.

## 7. Notes

- The AI API key lives only in `backend/.env` and is read by the Flask
  server — it is never sent to or exposed in the frontend.
- `backend/codecraft.db` is created automatically on first run and is
  ignored by git (see `.gitignore`).
- This project intentionally has no login, admin panel, or payment
  system — it focuses on the core workflow: describe → generate →
  explain → copy/download → save → revisit in history.
