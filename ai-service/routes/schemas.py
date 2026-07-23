from pydantic import BaseModel


# ============================================
# Common Text Request
# Used by:
# - /analyze
# - /embedding
# ============================================

class AnalyzeRequest(BaseModel):
    text: str


# ============================================
# Assistant Memory Context
# ============================================

class MemoryContext(BaseModel):
    id: str
    title: str
    summary: str
    category: str
    content: str


# ============================================
# Assistant Request
# ============================================

class AssistantRequest(BaseModel):
    question: str
    memories: list[MemoryContext]