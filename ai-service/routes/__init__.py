from .analyze import router as analyze_router
from .assistant import router as assistant_router
from .embedding import router as embedding_router
from .summary import router as summary_router
from .transcribe import router as transcribe_router

__all__ = [
    "analyze_router",
    "assistant_router",
    "embedding_router",
    "summary_router",
    "transcribe_router",
]