import os
import shutil
import tempfile

from fastapi import FastAPI, UploadFile, File

from models.whisper import transcribe

app = FastAPI(title="MemoryOS AI Service")


@app.get("/")
def home():
    return {
        "status": "MemoryOS AI Service Running"
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