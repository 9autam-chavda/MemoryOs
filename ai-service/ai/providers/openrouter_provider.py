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
            "google/gemma-4-31b:free"
        )

    def generate(self, prompt: str) -> str:

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are MemoryOS Assistant. "
                        "Answer ONLY using the provided memory context. "
                        "If the answer is not contained in the context, "
                        "say you couldn't find it."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2,
            max_tokens=700,
        )

        return response.choices[0].message.content