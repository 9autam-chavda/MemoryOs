from fastapi import FastAPI
from routes import analyze_router, assistant_router, embedding_router, transcribe_router

app = FastAPI(title="MemoryOS AI Service")

@app.get("/")
def home():
    return {"status": "MemoryOS AI Service Running"}


app.include_router(analyze_router)
app.include_router(embedding_router)
app.include_router(transcribe_router)
app.include_router(assistant_router)
