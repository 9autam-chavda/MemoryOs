"""Audio transcription endpoint."""

import logging
import os
import shutil
import tempfile

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from models.whisper import transcribe

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)) -> dict:
    """Transcribe an uploaded audio file using the existing Whisper model."""
    temp_path: str | None = None
    try:
        suffix = os.path.splitext(file.filename or "")[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            shutil.copyfileobj(file.file, temp)
            temp_path = temp.name

        return {"success": True, "text": transcribe(temp_path)}
    except Exception:
        logger.exception("Audio transcription failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to transcribe audio.",
        )
    finally:
        await file.close()
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
