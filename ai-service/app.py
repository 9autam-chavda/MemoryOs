from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import (
    analyze_router,
    assistant_router,
    embedding_router,
    summary_router,
    transcribe_router,
)

app = FastAPI(title="MemoryOS AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "MemoryOS AI Service Running"}

app.include_router(analyze_router)
app.include_router(embedding_router)
app.include_router(transcribe_router)
app.include_router(assistant_router)
app.include_router(summary_router)