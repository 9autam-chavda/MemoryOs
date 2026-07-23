from ai.providers.provider_factory import ProviderFactory
from ai.services.prompt_service import PromptService


class LLMService:

    def __init__(self):
        self.provider = ProviderFactory.get_provider()
        self.prompt_service = PromptService()

    def generate(
        self,
        question: str,
        memories: list,
        history: list,
    ) -> str:

        prompt = self.prompt_service.build(
            question=question,
            memories=memories,
            history=history,
        )

        answer = self.provider.generate(prompt)

        return answer