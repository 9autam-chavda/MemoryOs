import logging

from fastapi import APIRouter, HTTPException

from ai.services.summary_service import generate_summary
from .schemas import AnalyzeRequest

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/summary")
def summary(request: AnalyzeRequest):

    try:

        return {
            "summary": generate_summary(request.text)
        }

    except Exception:

        logger.exception("Summary generation failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to generate summary.",
        )