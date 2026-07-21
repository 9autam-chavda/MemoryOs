"""Request models shared by HTTP routes."""

from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    text: str


class AssistantRequest(BaseModel):
    question: str
    context: str
