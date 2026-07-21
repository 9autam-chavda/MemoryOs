"""Upload-time text analysis endpoint."""

import logging

from fastapi import APIRouter, HTTPException, status

from ai.analyzer import analyze
from .schemas import AnalyzeRequest

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/analyze")
def analyze_text(request: AnalyzeRequest) -> dict:
    """Run the existing summary, classification, tag, and embedding pipeline."""
    try:
        return {"success": True, **analyze(request.text)}
    except Exception:
        logger.exception("Text analysis failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to analyze text.",
        )
