import os
import shutil
import tempfile

from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

from models.whisper import transcribe
from ai.analyzer import analyze

app = FastAPI(title="MemoryOS AI Service")


class AnalyzeRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "status": "MemoryOS AI Service Running"
    }


@app.post("/analyze")
def analyze_text(request: AnalyzeRequest):

    return {
        "success": True,
        **analyze(request.text)
    }


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):

    suffix = os.path.splitext(file.filename)[1]

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp:

        shutil.copyfileobj(file.file, temp)

        temp_path = temp.name

    try:

        text = transcribe(temp_path)

        return {
            "success": True,
            "text": text
        }

    finally:
        os.remove(temp_path)