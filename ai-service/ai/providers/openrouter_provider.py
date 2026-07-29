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
            raise RuntimeError(
                f"OpenRouter generation failed: {error}"
            ) from error