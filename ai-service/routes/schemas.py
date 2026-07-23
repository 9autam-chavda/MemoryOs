from pydantic import BaseModel


# ============================================
# Common Text Request
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
# Conversation History
# ============================================

class HistoryMessage(BaseModel):
    role: str
    content: str


# ============================================
# Assistant Request
# ============================================

class AssistantRequest(BaseModel):
    question: str
    memories: list[MemoryContext]
    history: list[HistoryMessage] = []