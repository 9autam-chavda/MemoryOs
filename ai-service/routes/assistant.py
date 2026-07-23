"""Memory-grounded assistant endpoint."""

import logging
import os

from fastapi import APIRouter, HTTPException, status

from ai.tasks.assistant import AssistantTask
from .schemas import AssistantRequest

logger = logging.getLogger(__name__)
router = APIRouter()


def _debug(message: str, **details):
    if os.getenv("RAG_DEBUG") == "true":
        logger.info("[RAG assistant] %s %s", message, details)


@router.post("/assistant")
def ask_assistant(request: AssistantRequest):

    try:

        _debug(
            "INPUT",
            question=request.question,
            memories=len(request.memories),
        )

        answer = AssistantTask().execute(
            request.question,
            request.memories,
        )

        return {
            "success": True,
            "answer": answer,
        }

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(error),
        )

    except Exception:

        logger.exception("Assistant request failed")

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to generate assistant response.",
        )