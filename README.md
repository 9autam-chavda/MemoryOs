<div align="center">


# MemoryOS

### 🧠 AI-Powered Personal Memory Search Engine

Transform screenshots, documents, videos, audio recordings, and notes into an intelligent, searchable knowledge base powered by Artificial Intelligence.

<p align="center">
  <a href="https://memoryos-red.vercel.app"><strong>🌐 Live Demo</strong></a>
  ·
  <a href="#features"><strong>✨ Features</strong></a>
  ·
  <a href="#architecture"><strong>🏗 Architecture</strong></a>
  ·
  <a href="#installation"><strong>⚙ Installation</strong></a>
</p>

<p align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react"/>

<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js"/>

<img src="https://img.shields.io/badge/FastAPI-AI-009688?style=for-the-badge&logo=fastapi"/>

<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb"/>

<img src="https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google"/>

<img src="https://img.shields.io/badge/Whisper-Transcription-7B68EE?style=for-the-badge"/>

<img src="https://img.shields.io/badge/OCR-Tesseract-5C3EE8?style=for-the-badge"/>

<img src="https://img.shields.io/badge/RAG-Semantic%20Search-purple?style=for-the-badge"/>

</p>

<p align="center">

<img src="https://img.shields.io/github/license/gautam-chavda/MemoryOs?style=flat-square"/>

<img src="https://img.shields.io/github/last-commit/gautam-chavda/MemoryOs?style=flat-square"/>

<img src="https://img.shields.io/github/repo-size/gautam-chavda/MemoryOs?style=flat-square"/>

<img src="https://img.shields.io/github/languages/top/gautam-chavda/MemoryOs?style=flat-square"/>

</p>

</div>

---

## 🚀 Overview

MemoryOS is an AI-powered Second Brain that transforms your digital memories into an intelligent knowledge base.

Instead of manually searching through thousands of screenshots, PDFs, videos, voice recordings, and documents, MemoryOS understands their content using Artificial Intelligence and allows users to retrieve information through natural language conversations.

Built around Retrieval-Augmented Generation (RAG), semantic embeddings, OCR, speech-to-text, and Large Language Models, MemoryOS helps users instantly rediscover information they have already seen but cannot remember where it was stored.

Whether it's a forgotten screenshot, an internship report, lecture notes, a coding tutorial, or a meeting recording, MemoryOS makes every memory searchable.

---

## ✨ Why MemoryOS?

Traditional file storage answers:

> **"Where is my file?"**

MemoryOS answers:

> **"What do I know about this?"**

Instead of organizing folders manually, users simply upload content.

MemoryOS automatically:

- 📄 Extracts text from documents
- 🖼 Performs OCR on images
- 🎙 Transcribes audio and video
- 🏷 Generates AI tags
- 📝 Creates summaries
- 🧠 Builds semantic embeddings
- 🔍 Retrieves relevant memories using vector similarity
- 🤖 Answers questions using Retrieval-Augmented Generation (RAG)

---

## 🎯 Live Demo

| Service | URL |
|----------|-----|
| 🌐 Frontend | https://memoryos-red.vercel.app |
| ⚙ Backend API | https://memoryos-backend-z6b0.onrender.com |
| 🤖 AI Service | https://memoryos-ai-8hch.onrender.com |

---

## 📑 Table of Contents

- Overview
- Features
- System Architecture
- AI Processing Pipeline
- RAG Pipeline
- Technology Stack
- Folder Structure
- Installation
- Environment Variables
- API Documentation
- Deployment
- Screenshots
- Performance
- Security
- Roadmap
- Contributing
- License

---

# ✨ Features

MemoryOS combines modern full-stack development with Artificial Intelligence to build a true personal memory retrieval system.

## 🧠 AI-Powered Memory Intelligence

| Feature | Description |
|----------|-------------|
| 🔍 Semantic Search | Search memories using meaning instead of exact keywords through vector embeddings. |
| 🤖 AI Assistant | Ask natural language questions and receive contextual answers powered by Retrieval-Augmented Generation (RAG). |
| 📝 AI Summaries | Automatically generates concise summaries for every uploaded memory. |
| 🏷 Smart Tagging | AI creates descriptive tags to improve retrieval quality. |
| 📂 Automatic Categorization | Organizes memories into meaningful categories without manual effort. |
| 🔄 Related Memories | Discovers semantically similar memories across your entire knowledge base. |

---

## 📁 Multi-Modal Memory Processing

MemoryOS supports multiple content types and automatically extracts searchable information.

| Content Type | Processing |
|--------------|------------|
| 🖼 Images | OCR text extraction using Tesseract |
| 📄 PDF Documents | Text extraction and AI analysis |
| 🎥 Videos | Audio extraction + Whisper transcription |
| 🎙 Audio Files | Speech-to-text transcription |
| 📑 Documents | Semantic indexing and summarization |

---

## 🚀 Intelligent Upload Pipeline

Every uploaded memory passes through an asynchronous AI pipeline.

```
Upload File
      │
      ▼
Extract Content
      │
      ▼
OCR / Speech Recognition
      │
      ▼
AI Summary Generation
      │
      ▼
AI Category Classification
      │
      ▼
AI Tag Generation
      │
      ▼
Embedding Generation
      │
      ▼
Store in MongoDB
      │
      ▼
Ready for Semantic Search
```

The pipeline runs in the background, allowing users to continue using the application while AI processing is performed asynchronously.

---

## 🔎 Retrieval-Augmented Generation (RAG)

Instead of asking an LLM to hallucinate an answer, MemoryOS retrieves relevant memories before generating a response.

```
User Question
      │
      ▼
Query Analysis
      │
      ▼
Embedding Generation
      │
      ▼
Hybrid Retrieval
      │
      ├──────── Semantic Search
      ├──────── Keyword Search
      ├──────── Filename Search
      ├──────── Category Search
      └──────── Tag Search
      │
      ▼
Merge Results
      │
      ▼
AI Re-ranking
      │
      ▼
Context Builder
      │
      ▼
Prompt Engineering
      │
      ▼
OpenRouter LLM
      │
      ▼
Final Answer
```

This architecture improves factual accuracy by grounding responses in the user's own uploaded memories.

---

# 🌟 Core Capabilities

## 🔐 Authentication & Security

- JWT Authentication
- Email Verification via OTP
- Forgot Password with OTP
- Secure Password Hashing using bcrypt
- Protected API Routes
- Session-based Assistant Conversations

---

## 📚 Memory Management

- Upload multiple file formats
- AI-powered processing
- Favorite memories
- Public sharing via secure links
- Memory search
- Related memory recommendations
- Delete memories
- View processing status in real time

---

## 🤖 AI Assistant

The MemoryOS Assistant can:

- Answer questions from uploaded knowledge
- Remember previous conversation context
- Cite relevant uploaded memories
- Retrieve information using semantic similarity
- Respond only from user-owned knowledge
- Prevent hallucinations through Retrieval-Augmented Generation

---

## ⚡ Performance Optimizations

- Asynchronous AI processing
- Background upload queue
- Debounced search
- Hybrid retrieval pipeline
- AI response caching
- Cosine similarity optimization
- Modular microservice architecture
- Lazy loading on the frontend

---

# 🎯 What Problem Does MemoryOS Solve?

Modern users save thousands of pieces of information every year.

- Screenshots
- Lecture notes
- PDF books
- Research papers
- Meeting recordings
- Voice notes
- Coding tutorials
- Invoices
- Certificates
- Important documents

While storage has become inexpensive, **retrieval remains difficult**.

Traditional folders and keyword search require users to remember where something was saved.

MemoryOS removes this burden by understanding the content itself.

Instead of asking:

> "Where did I save this?"

Users simply ask:

> "What were the React optimization techniques from that PDF?"

or

> "Show me the internship report I uploaded last month."

or

> "Summarize my Operating Systems notes."

MemoryOS searches the user's knowledge—not filenames—to deliver accurate, contextual answers.

---

# 💡 Why MemoryOS?

MemoryOS is more than cloud storage.

It is an AI-powered knowledge retrieval system designed to help users rediscover information they have already encountered but can no longer locate.

Unlike traditional search systems that depend on filenames or exact keywords, MemoryOS understands the semantic meaning of uploaded content, making every memory instantly searchable through natural language.

The result is a personal Second Brain capable of organizing, understanding, and retrieving knowledge at scale.

# 🏗 System Architecture

MemoryOS follows a distributed microservice architecture that separates user-facing functionality from AI-intensive processing. This design improves scalability, maintainability, and allows independent deployment of each service.

```
                        ┌──────────────────────────────┐
                        │        React Frontend        │
                        │                              │
                        │ • Authentication             │
                        │ • Dashboard                  │
                        │ • Upload Manager             │
                        │ • Gallery                    │
                        │ • AI Assistant               │
                        └──────────────┬───────────────┘
                                       │
                                       │ HTTPS REST API
                                       ▼
                    ┌────────────────────────────────────────┐
                    │          Node.js Backend API           │
                    │                                        │
                    │ • Authentication                       │
                    │ • JWT Authorization                    │
                    │ • Upload Management                    │
                    │ • Memory CRUD                          │
                    │ • Session Management                   │
                    │ • Retrieval Pipeline                   │
                    └──────────────┬─────────────────────────┘
                                   │
              ┌────────────────────┼─────────────────────┐
              │                    │                     │
              ▼                    ▼                     ▼
     MongoDB Atlas          AI Service            Cloud Storage
     Memory Database          FastAPI               ImageKit
```

---

# 🤖 AI Service Architecture

The AI Service is implemented as an independent FastAPI microservice responsible for every AI-related operation.

```
                    FastAPI AI Service

          ┌──────────────────────────────┐
          │      Upload Processing       │
          └──────────────┬───────────────┘
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
        ▼                ▼                 ▼
      OCR           Whisper STT       PDF Parser
   (Images)       (Audio/Video)      (Documents)
        │                │                 │
        └────────────────┴─────────────────┘
                         │
                         ▼
                 Content Extraction
                         │
                         ▼
                  AI Text Analysis
                         │
         ┌───────────────┼────────────────┐
         │               │                │
         ▼               ▼                ▼
     Summary        Category        Smart Tags
                         │
                         ▼
               Jina Embedding Model
                         │
                         ▼
              1024-Dimensional Vector
                         │
                         ▼
                 Stored in MongoDB
```

---

# 🔍 Retrieval-Augmented Generation Pipeline

When a user asks a question, MemoryOS does not directly send it to a Large Language Model.

Instead, it retrieves relevant memories first and then grounds the AI response using those memories.

```
User Question

       │
       ▼

Query Analyzer

       │
       ▼

Embedding Generation

       │
       ▼

Hybrid Retrieval

       │

 ┌─────┼─────────────────────────────────────┐
 │     │         │          │                │
 ▼     ▼         ▼          ▼                ▼

Semantic   Keyword   Filename   Category   Tag Search
 Search      Search     Search      Search

 └─────────────── Merge Results ───────────────┘

                    │

                    ▼

             AI Re-ranking

                    │

                    ▼

            Context Builder

                    │

                    ▼

          Prompt Engineering

                    │

                    ▼

        OpenRouter Large Language Model

                    │

                    ▼

            Final AI Response
```

---

# 📤 Upload Processing Pipeline

Every uploaded file follows the same intelligent processing workflow.

```
User Upload

      │

      ▼

File Validation

      │

      ▼

Content Extraction

      │

      ├──────── OCR

      ├──────── Speech Recognition

      ├──────── PDF Parsing

      └──────── Text Extraction

      │

      ▼

AI Summary

      │

      ▼

AI Category Classification

      │

      ▼

AI Tag Generation

      │

      ▼

Embedding Generation

      │

      ▼

MongoDB Storage

      │

      ▼

Ready for Semantic Search
```

---

# 📂 Project Structure

```
MemoryOS
│
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   └── public/
│
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── ai/
│   │   │   ├── pipeline/
│   │   │   ├── retrieval/
│   │   │   └── ranking/
│   │   └── utils/
│
├── ai-service/                 # FastAPI AI Microservice
│   ├── ai/
│   ├── routes/
│   ├── providers/
│   ├── services/
│   ├── models/
│   └── app.py
│
└── docs/
```

---

# 🔄 Deployment Architecture

MemoryOS is deployed as three independent services.

```
                 Vercel

                   │

                   ▼

            React Frontend

                   │

                   ▼

          Render Backend API

             │          │

             ▼          ▼

      MongoDB Atlas   FastAPI AI Service

                            │

                            ▼

                     OpenRouter LLM

                            │

                            ▼

                      Jina Embeddings
```

---

# ⚙ Design Principles

MemoryOS was designed around a set of engineering principles:

- **Microservice Architecture** — AI processing is isolated from the backend API.
- **Asynchronous Processing** — Long-running AI tasks execute without blocking the user interface.
- **Retrieval-Augmented Generation (RAG)** — AI responses are grounded in retrieved user memories rather than relying solely on model knowledge.
- **Semantic Understanding** — Content is indexed using vector embeddings instead of keyword-only search.
- **Modular Pipeline** — Query analysis, retrieval, reranking, context building, and response generation are implemented as independent modules for maintainability.
- **Production-Ready Deployment** — Frontend, backend, AI service, database, and email infrastructure are independently deployable and horizontally scalable.

# 💻 Technology Stack

MemoryOS is built using a modern AI-first technology stack designed for scalability, modularity, and production deployment.

---

## 🌐 Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | User Interface |
| Vite | Frontend Build Tool |
| React Router | Client-side Routing |
| Axios | API Communication |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| React Hot Toast | Notifications |

---

## ⚙ Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | REST API Framework |
| MongoDB Atlas | Database |
| Mongoose | Object Data Modeling |
| JWT | Authentication |
| Multer | File Upload Handling |
| bcrypt | Password Hashing |
| Brevo | Transactional Emails |

---

## 🤖 AI Service

| Technology | Purpose |
|------------|---------|
| FastAPI | AI Microservice |
| OpenRouter | LLM Gateway |
| Google Gemma 4 | Response Generation |
| Jina Embeddings v4 | Semantic Embeddings |
| Faster Whisper | Audio & Video Transcription |
| Tesseract OCR | Image Text Extraction |

---

## ☁ Infrastructure

| Service | Purpose |
|----------|---------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| Render | AI Service Hosting |
| MongoDB Atlas | Cloud Database |
| ImageKit | Media Storage & CDN |
| Brevo | Email Delivery |

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/9autam-chavda/MemoryOs.git

cd MemoryOs
```

---

# 📦 Project Structure

```text
MemoryOs/
│
├── client/
├── server/
└── ai-service/
```

Each service runs independently.

---

# ⚙ Backend Setup

```bash
cd server

npm install
```

Create

```text
server/.env
```

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

Start

```bash
npm run dev
```

Backend

```
http://localhost:5000
```

---

# 🤖 AI Service Setup

```bash
cd ai-service

pip install -r requirements.txt
```

Create

```text
ai-service/.env
```

```env
OPENROUTER_API_KEY=

OPENROUTER_MODEL=google/gemma-3-27b-it:free

LLM_PROVIDER=openrouter

JINA_API_KEY=

RAG_DEBUG=false
```

Run

```bash
uvicorn app:app --reload
```

AI Service

```
http://127.0.0.1:8000
```

---

# 🌐 Frontend Setup

```bash
cd client

npm install
```

Create

```text
client/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

Run

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 🏃 Running MemoryOS

Start the services in the following order.

### 1️⃣ AI Service

```bash
cd ai-service

uvicorn app:app --reload
```

---

### 2️⃣ Backend

```bash
cd server

npm run dev
```

---

### 3️⃣ Frontend

```bash
cd client

npm run dev
```

---

Open

```
http://localhost:5173
```

MemoryOS is now ready.

---

# 📁 Environment Variables

## Frontend

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |

---

## Backend

| Variable | Description |
|----------|-------------|
| PORT | Backend Port |
| MONGODB_URI | MongoDB Atlas Connection |
| JWT_SECRET | JWT Secret |
| IMAGEKIT_PUBLIC_KEY | ImageKit Public Key |
| IMAGEKIT_PRIVATE_KEY | ImageKit Private Key |
| IMAGEKIT_URL_ENDPOINT | ImageKit Endpoint |
| BREVO_API_KEY | Email Service API Key |
| EMAIL_FROM_NAME | Sender Name |
| EMAIL_FROM_ADDRESS | Sender Email |
| AI_SERVICE_URL | FastAPI Service URL |
| CLIENT_URL | Frontend URL |

---

## AI Service

| Variable | Description |
|----------|-------------|
| OPENROUTER_API_KEY | OpenRouter API Key |
| OPENROUTER_MODEL | LLM Model |
| LLM_PROVIDER | AI Provider |
| JINA_API_KEY | Embedding API |
| RAG_DEBUG | Debug Logs |

---

# 🌍 Production Deployment

MemoryOS is deployed using independent cloud services.

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| AI Service | Render |
| Database | MongoDB Atlas |
| File Storage | ImageKit |
| Email | Brevo |

This architecture enables each component to scale independently without affecting the rest of the system.

---

# 🔧 Developer Notes

MemoryOS follows a modular architecture.

```
Frontend
        │
        ▼
Backend API
        │
        ▼
AI Service
        │
        ▼
OpenRouter
```

The AI service is intentionally isolated from the backend to simplify maintenance, deployment, and future model upgrades.

---

# 📈 Scalability

The architecture allows future upgrades without changing the frontend.

Examples include:

- Switching to another embedding model
- Replacing the LLM provider
- Adding vector databases
- Supporting additional document formats
- Streaming AI responses
- Multi-user workspaces
- Mobile clients

# 📡 API Documentation

MemoryOS exposes a RESTful API that powers the web application and AI assistant. The backend communicates with a dedicated FastAPI AI microservice for AI-powered processing while maintaining a clean separation of responsibilities.

---

# 🔐 Authentication APIs

## Register User

```http
POST /api/auth/register
```

Creates a new user account and sends an email verification OTP.

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "********"
}
```

### Response

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email."
}
```

---

## Verify Email

```http
POST /api/auth/verify-email
```

Verifies the user's email using the OTP received via email.

### Request

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

---

## Login

```http
POST /api/auth/login
```

Authenticates the user and returns a JWT access token.

### Request

```json
{
  "email": "john@example.com",
  "password": "********"
}
```

### Response

```json
{
  "success": true,
  "token": "...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Forgot Password

```http
POST /api/auth/forgot-password
```

Sends a password reset OTP to the registered email.

---

## Reset Password

```http
POST /api/auth/reset-password
```

Updates the user's password after successful OTP verification.

---

# 📂 Memory APIs

## Upload Memory

```http
POST /api/memory/upload
```

Uploads a new memory and starts asynchronous AI processing.

Supports:

- Images
- PDFs
- Videos
- Audio
- Text Documents

---

## Get Memories

```http
GET /api/memory
```

Returns the authenticated user's uploaded memories.

Supports filtering by:

- Image
- PDF
- Video
- Audio
- All

---

## Get Memory Details

```http
GET /api/memory/:id
```

Returns detailed information for a specific memory.

---

## Search Memories

```http
GET /api/memory/search?q=...
```

Searches memories using semantic retrieval and keyword matching.

---

## Related Memories

```http
GET /api/memory/:id/related
```

Returns semantically similar memories using cosine similarity.

---

## Favorite Memory

```http
PATCH /api/memory/:id/favorite
```

Marks or removes a memory as a favorite.

---

## Delete Memory

```http
DELETE /api/memory/:id
```

Permanently deletes a memory.

---

## Share Memory

```http
POST /api/memory/:id/share
```

Creates a secure public sharing link.

---

## Disable Share

```http
DELETE /api/memory/:id/share
```

Revokes public access to a shared memory.

---

# 🤖 AI Assistant APIs

## Ask Assistant

```http
POST /api/assistant
```

Allows users to ask natural language questions against their uploaded knowledge base.

### Request

```json
{
    "sessionId": "...",
    "question": "Summarize my Operating Systems notes."
}
```

### Response

```json
{
    "success": true,
    "answer": "...",
    "sources": [],
    "metadata": {}
}
```

---

# 💬 Conversation APIs

MemoryOS stores assistant conversations for context-aware interactions.

## Create Session

```http
POST /api/memory-sessions
```

Creates a new assistant conversation.

---

## Get Sessions

```http
GET /api/memory-sessions
```

Returns all user conversations.

---

## Get Messages

```http
GET /api/memory-sessions/:id/messages
```

Returns conversation history for a session.

---

# 🤖 AI Service Endpoints

The backend communicates with a dedicated FastAPI AI microservice.

These endpoints are internal and are not intended for direct frontend usage.

| Endpoint | Purpose |
|----------|----------|
| `/analyze` | AI Summary, Category & Tags |
| `/embedding` | Generate Jina Embeddings |
| `/summary` | Generate standalone summary |
| `/assistant` | Generate AI response |
| `/transcribe` | OCR / Whisper transcription |

---

# 🔐 Authentication

Protected routes require a JWT access token.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📤 Upload Workflow

```
Client

    │

POST /memory/upload

    │

Backend

    │

Stores File

    │

Background AI Processing

    │

FastAPI AI Service

    │

Summary

Category

Tags

Embedding

    │

MongoDB

    │

Ready
```

---

# 📥 Response Format

Every API follows a consistent response structure.

## Success

```json
{
    "success": true,
    "data": {},
    "message": "Operation completed successfully."
}
```

---

## Error

```json
{
    "success": false,
    "message": "Error description."
}
```

This standardized format simplifies frontend integration and improves maintainability.

---

# 🛡 Security

MemoryOS follows several security best practices.

- JWT Authentication
- Password hashing using bcrypt
- Email verification before login
- Password reset via OTP
- Protected API routes
- Environment variables for secrets
- CORS protection
- Request validation
- Secure file upload pipeline
- AI service isolation
- Microservice architecture

Sensitive credentials such as API keys and database credentials are never committed to the repository.

# 🌐 Live Demo

Experience MemoryOS in action:

**Frontend:** https://memoryos-red.vercel.app

> **Note**
>
> New users can register for an account to explore the complete AI-powered memory retrieval experience.

---

# ⚡ Engineering Decisions & Performance

MemoryOS was designed with scalability, maintainability, and AI reliability as primary goals. Rather than coupling all functionality into a monolithic application, the system separates user-facing operations from AI-intensive workloads through a dedicated microservice architecture.

---

## 🚀 Asynchronous AI Processing

AI operations such as OCR, transcription, summarization, categorization, and embedding generation are computationally expensive.

Instead of blocking the upload request, MemoryOS processes these tasks asynchronously.

### Benefits

- Faster upload experience
- Better user responsiveness
- Scalable processing pipeline
- Improved fault isolation

---

## 🧠 Retrieval-Augmented Generation (RAG)

Large Language Models can generate convincing but incorrect answers.

To improve factual accuracy, MemoryOS implements Retrieval-Augmented Generation (RAG).

Instead of relying solely on model knowledge, the assistant:

1. Understands the user's question
2. Retrieves relevant memories
3. Builds contextual prompts
4. Generates grounded responses

This significantly reduces hallucinations while ensuring answers are based on the user's own uploaded knowledge.

---

## 🔍 Hybrid Retrieval Strategy

Memory retrieval does not rely on semantic similarity alone.

MemoryOS combines multiple retrieval techniques:

- Semantic Search
- Keyword Search
- Filename Search
- Category Matching
- Tag Matching

The retrieved candidates are merged and re-ranked before generating the final response.

This hybrid strategy improves recall while maintaining relevance.

---

## 🎯 Semantic Embeddings

Every processed memory is transformed into a **1024-dimensional embedding vector** using **Jina Embeddings**.

These embeddings capture semantic meaning rather than exact keywords, enabling natural language search across different file types.

Examples:

> "Operating Systems notes"

can successfully retrieve a document titled

> "OS Lecture 4"

even if the exact phrase does not appear.

---

## 🤖 Modular AI Pipeline

Each AI capability is implemented as an independent module.

Current pipeline modules include:

- OCR
- Audio Transcription
- Text Analysis
- Summary Generation
- Category Classification
- Tag Generation
- Embedding Generation
- Response Generation

This modular architecture simplifies maintenance and future model upgrades.

---

## 📦 Microservice Architecture

MemoryOS separates responsibilities into three independent services.

| Service | Responsibility |
|----------|----------------|
| React Frontend | User Interface |
| Express Backend | Authentication, Memory Management, API |
| FastAPI AI Service | AI Processing and LLM Integration |

Benefits include:

- Independent deployment
- Easier scaling
- Cleaner codebase
- Better maintainability
- Improved fault isolation

---

## ⚙ Prompt Engineering

The assistant follows a structured prompt generation pipeline.

Before calling the language model, MemoryOS:

- Builds conversation history
- Selects relevant memories
- Constructs contextual prompts
- Applies response constraints
- Grounds answers in retrieved information

This improves response quality while minimizing fabricated information.

---

## 🔐 Security Considerations

MemoryOS incorporates multiple security practices throughout the application.

- JWT Authentication
- Email Verification
- Password Reset via OTP
- Password Hashing with bcrypt
- Protected API Routes
- Environment-based Secret Management
- CORS Protection
- Input Validation

No sensitive credentials are committed to the repository.

---

## 📈 Scalability

The architecture has been designed to support future enhancements without major refactoring.

Potential upgrades include:

- Vector Databases
- Streaming AI Responses
- Multi-LLM Support
- Browser Extension
- Mobile Applications
- Team Workspaces
- Distributed AI Workers

The modular design allows these features to be introduced incrementally while preserving the existing architecture.

# 🗺 Roadmap

MemoryOS is actively evolving from a personal AI memory manager into a complete AI-powered knowledge operating system.

## 🚀 Version 1.1

- [ ] Improve Retrieval-Augmented Generation (RAG) accuracy
- [ ] Streaming AI responses
- [ ] Better memory ranking and reranking
- [ ] Advanced prompt engineering
- [ ] Improved assistant user interface

---

## 🚀 Version 1.2

- [ ] Memory collections and folders
- [ ] Advanced filtering
- [ ] Memory timeline
- [ ] Bulk upload improvements
- [ ] Rich document preview

---

## 🚀 Version 2.0

- [ ] Chrome extension for one-click memory capture
- [ ] Browser history integration
- [ ] AI-powered memory recommendations
- [ ] Offline desktop application
- [ ] Mobile application

---

## 🚀 Future Vision

MemoryOS aims to become an intelligent personal knowledge operating system capable of understanding, organizing, and retrieving everything users have learned throughout their digital lives.

Future research areas include:

- Vector databases
- Multi-agent AI workflows
- Personalized AI memory ranking
- Knowledge graph generation
- Team workspaces
- Enterprise knowledge search

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to improve MemoryOS:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push your branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

Please ensure your code follows the existing project structure and coding style.

---

# 📄 License

This project is licensed under the MIT License.

See the LICENSE file for more information.

---

# 👨‍💻 Author

## Gautam Chavda

IT Engineering Student • Full Stack Developer • AI Enthusiast

### Connect with me

- GitHub: https://github.com/9autam-chavda

---

# 🙏 Acknowledgements

MemoryOS would not have been possible without these incredible technologies and communities.

- React
- Node.js
- Express.js
- FastAPI
- MongoDB Atlas
- OpenRouter
- Google Gemma
- Jina AI
- Faster Whisper
- Tesseract OCR
- ImageKit
- Brevo
- Vercel
- Render

Special thanks to the open-source community for building the tools that make projects like MemoryOS possible.

---

# ⭐ Support the Project

If you found MemoryOS useful or interesting, consider giving this repository a ⭐ on GitHub.

Your support motivates future development and helps others discover the project.

---

## 🤝 Acknowledgements

MemoryOS was designed and developed by **Gautam Chavda**.

Throughout development, AI-assisted tools were used for brainstorming, debugging, documentation, code review, and accelerating development, while all architecture, implementation decisions, integration, testing, and deployment were completed by the project author.

Special thanks to the open-source community and the teams behind React, Node.js, FastAPI, MongoDB, OpenRouter, Jina AI, Faster Whisper, Tesseract OCR, ImageKit, Brevo, Vercel, and Render for building the technologies that made this project possible.
