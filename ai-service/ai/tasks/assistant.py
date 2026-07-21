from ai.services.llm_service import LLMService


class AssistantTask:
    """Orchestrates a single memory-grounded assistant request."""

    def __init__(self, llm_service: LLMService | None = None) -> None:
        self.llm_service = llm_service or LLMService()

    def execute(
        self,
        question: str,
        context: str,
    ) -> str:
        return self.llm_service.generate(question, context)
