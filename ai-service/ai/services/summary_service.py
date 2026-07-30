from ai.services.llm_service import LLMService

llm = LLMService()


def generate_summary(text: str) -> str:

    if not text.strip():
        return ""

    prompt = f"""
You are an AI memory assistant.

Summarize the following content.

Rules:
- Maximum 2 sentences.
- Preserve important facts.
- Do not invent information.
- Plain English.
- No markdown.

Content:

{text}
"""

    return llm.generate(prompt).strip()