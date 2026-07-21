import os

from google import genai
from dotenv import load_dotenv

load_dotenv()


class GeminiProvider:
    """Thin adapter around the Gemini SDK."""

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY is missing.")

        self.client = genai.Client(api_key=api_key)

        self.model = os.getenv("MODEL_NAME", "gemini-2.5-flash")

    def generate(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )
        return response.text or "I couldn't find an answer in the provided memories."
