from ai.providers.provider_factory import ProviderFactory


class LLMService:

    def __init__(self):
        self.provider = ProviderFactory.get_provider()

    def generate(self, prompt: str) -> str:
        return self.provider.generate(prompt)