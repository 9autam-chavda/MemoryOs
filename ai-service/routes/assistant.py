"""Memory-grounded assistant endpoint."""

import logging

from fastapi import APIRouter, HTTPException, status

from ai.tasks.assistant import AssistantTask
from .schemas import AssistantRequest

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/assistant")
def ask_assistant(request: AssistantRequest) -> dict:
    """Answer a question from caller-provided memory context."""
    try:
        answer = AssistantTask().execute(request.question, request.context)
        return {"success": True, "answer": answer}
    except ValueError as error:
        logger.warning("Assistant configuration error: %s", error)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Assistant service is not configured.",
        )
    except Exception:
        logger.exception("Assistant request failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to generate an assistant response.",
        )
