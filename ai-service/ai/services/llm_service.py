from ai.providers.gemini_provider import GeminiProvider
from ai.services.prompt_service import PromptService


class LLMService:
    """Builds a prompt and delegates generation to the configured provider."""

    def __init__(
        self,
        provider: GeminiProvider | None = None,
        prompt_service: PromptService | None = None,
    ) -> None:
        self.provider = provider or GeminiProvider()
        self.prompt_service = prompt_service or PromptService()

    def generate(
        self,
        question: str,
        context: str,
    ) -> str:
        prompt = self.prompt_service.build(question, context)

        return self.provider.generate(prompt)
