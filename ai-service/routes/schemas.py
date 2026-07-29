from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    text: str


class PromptRequest(BaseModel):
    prompt: str