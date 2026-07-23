from ai.services.llm_service import LLMService


class AssistantTask:

    def __init__(self):
        self.llm_service = LLMService()

    def execute(
        self,
        question: str,
        memories: list,
        history: list,
    ) -> str:

        return self.llm_service.generate(
            question=question,
            memories=memories,
            history=history,
        )