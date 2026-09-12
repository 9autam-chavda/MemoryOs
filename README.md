<div align="center">

# MemoryOS

### 🧠 AI-Powered Personal Memory Search Engine

Turn screenshots, documents, audio, video, and notes into a searchable personal knowledge base with AI-powered retrieval.

[🌐 Live Demo](https://memoryos-red.vercel.app)

</div>

---

## ✨ Features

- 🔍 **Semantic & hybrid search** — Find memories by meaning, keywords, filenames, categories, and tags.
- 🤖 **AI Assistant** — Ask natural-language questions over your uploaded memories using RAG.
- 📄 **Multi-modal processing** — Supports images, PDFs, documents, audio, and video.
- 🧠 **Automatic understanding** — Generates summaries, categories, tags, and embeddings.
- 🔗 **Related memories** — Finds semantically similar content.
- 🔐 **Authentication** — JWT auth, email verification, password reset, and protected routes.
- 📤 **Asynchronous processing** — AI-heavy upload tasks run in the background.
- ⭐ **Memory management** — Favorites, sharing, search, and deletion.

## 🏗 Architecture

MemoryOS uses three independently deployable services:

```text
React Frontend
      │
      ▼
Node.js / Express API
      │
      ├── MongoDB Atlas
      ├── ImageKit
      └── FastAPI AI Service
              │
              ├── OCR / Tesseract
              ├── Whisper transcription
              ├── Jina Embeddings
              └── OpenRouter LLM
```

### AI & RAG Flow

```text
Upload
  ↓
Content Extraction
  ↓
Summary / Category / Tags
  ↓
Embedding Generation
  ↓
MongoDB

User Question
  ↓
Hybrid Retrieval
  ↓
Re-ranking
  ↓
Context Building
  ↓
LLM Response
```

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Multer, bcrypt |
| AI Service | FastAPI, OpenRouter, Jina Embeddings, Faster Whisper, Tesseract OCR |
| Storage & Infrastructure | ImageKit, Vercel, Render, MongoDB Atlas, Brevo |

## 📂 Project Structure

```text
MemoryOS/
├── client/          # React frontend
├── server/          # Node.js / Express backend
├── ai-service/      # FastAPI AI service
└── docs/            # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Python 3.x
- MongoDB Atlas account
- ImageKit account
- OpenRouter API key
- Jina API key
- Brevo account/API key if email features are enabled

### 1. Clone

```bash
git clone https://github.com/9autam-chavda/MemoryOs.git
cd MemoryOs
```

### 2. Backend

```bash
cd server
npm install
npm run dev
```

Create `server/.env` with the values required by the backend:

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
BREVO_API_KEY=
EMAIL_FROM_NAME=MemoryOS
EMAIL_FROM_ADDRESS=
AI_SERVICE_URL=http://127.0.0.1:8000
CLIENT_URL=http://localhost:5173
```

### 3. AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload
```

Create `ai-service/.env`:

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemma-3-27b-it:free
LLM_PROVIDER=openrouter
JINA_API_KEY=
RAG_DEBUG=false
```

### 4. Frontend

```bash
cd client
npm install
npm run dev
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Open `http://localhost:5173`.

## 🌐 Deployment

MemoryOS is deployed as three application services with managed infrastructure:

| Service | Platform | URL |
|---|---|---|
| 🌐 Frontend | Vercel | https://memoryos-red.vercel.app |
| ⚙️ Backend API | Render | https://memoryos-backend-z6b0.onrender.com |
| 🤖 AI Service | Render | https://memoryos-ai-8hch.onrender.com |

**Infrastructure:** MongoDB Atlas · ImageKit · Brevo

> The Backend API and AI Service are primarily service endpoints and may not provide a user-facing web interface.

## 🔐 Security

- JWT-based authentication
- bcrypt password hashing
- Email verification and OTP password reset
- Protected API routes
- Environment-based secret management
- Input/request validation
- CORS protection
- Isolated AI service

Never commit API keys, database credentials, or other secrets to the repository.

## 🗺 Roadmap

Planned improvements include:

- Streaming AI responses
- Improved retrieval and re-ranking
- Memory collections and advanced filtering
- Browser extension / memory capture
- Mobile application

## 🤝 Contributing

Contributions are welcome. Fork the repository, create a feature branch, make your changes, and open a pull request.

## 📄 License

MIT — see [`LICENSE`](LICENSE).

## 👨‍💻 Author

**Gautam Chavda** — IT Engineering Student · Full Stack Developer · AI Enthusiast

- GitHub: [@9autam-chavda](https://github.com/9autam-chavda)
