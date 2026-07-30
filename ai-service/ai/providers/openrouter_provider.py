import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class OpenRouterProvider:
    def __init__(self):
        api_key = os.getenv("OPENROUTER_API_KEY")

        if not api_key:
            raise ValueError("OPENROUTER_API_KEY is missing.")

        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

        self.model = os.getenv(
            "OPENROUTER_MODEL",
            "google/gemma-3-27b-it:free",
        )

        self.temperature = float(
            os.getenv("LLM_TEMPERATURE", "0.2")
        )

        self.max_tokens = int(
            os.getenv("LLM_MAX_TOKENS", "700")
        )

    def generate(self, prompt: str) -> str:
        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )

            answer = response.choices[0].message.content

            if not answer:
                raise ValueError("Model returned an empty response.")

            return answer.strip()

        except Exception as error:
            message = str(error).lower()

            # Quota / Credits exhausted / Rate limit
            if (
                "429" in message
                or "quota" in message
                or "resource_exhausted" in message
                or "rate limit" in message
                or "credits" in message
            ):
                raise RuntimeError(
                    "The AI assistant is temporarily unavailable because the request limit has been reached. Please try again later."
                ) from error

            # Context window / Token limit
            if (
                "context" in message
                or "token" in message
                or "maximum context" in message
                or "context length" in message
            ):
                raise RuntimeError(
                    "The request is too large for the AI assistant. Please ask a more specific question."
                ) from error

            raise RuntimeError(
                f"OpenRouter generation failed: {error}"
            ) from error