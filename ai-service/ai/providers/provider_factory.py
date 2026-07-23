import os

from dotenv import load_dotenv

from ai.providers.openrouter_provider import OpenRouterProvider

load_dotenv()


class ProviderFactory:

    @staticmethod
    def get_provider():

        provider = os.getenv(
            "LLM_PROVIDER",
            "openrouter"
        ).lower()

        if provider == "openrouter":
            return OpenRouterProvider()

        raise ValueError(
            f"Unsupported LLM provider: {provider}"
        )