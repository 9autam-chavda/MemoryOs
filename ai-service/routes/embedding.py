"""Text embedding endpoint."""

import logging

from fastapi import APIRouter, HTTPException, status

from ai.embedding import generate_embedding
from .schemas import AnalyzeRequest

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/embedding")
def embedding(request: AnalyzeRequest) -> dict:
    """Generate an embedding using the existing embedding model."""
    try:
        return {"success": True, "embedding": generate_embedding(request.text)}
    except Exception:
        logger.exception("Embedding generation failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate embedding.",
        )
