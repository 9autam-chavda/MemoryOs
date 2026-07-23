from ai.services.llm_service import LLMService


class AssistantTask:

    def __init__(self):
        self.llm_service = LLMService()

    def execute(
        self,
        question: str,
        memories: list,
    ) -> str:

        return self.llm_service.generate(
            question,
            memories,
        )