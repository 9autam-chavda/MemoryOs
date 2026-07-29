import logging
import os

from fastapi import APIRouter, HTTPException, status

from ai.services.llm_service import LLMService
from .schemas import PromptRequest

logger = logging.getLogger(__name__)
router = APIRouter()

llm = LLMService()


def _debug(message: str, **details):
    if os.getenv("RAG_DEBUG") == "true":
        logger.info("[Assistant] %s %s", message, details)


@router.post("/assistant")
def ask_assistant(request: PromptRequest):

    try:

        _debug(
            "PROMPT",
            length=len(request.prompt),
        )

        answer = llm.generate(request.prompt)

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