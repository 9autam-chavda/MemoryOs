from ai.services.context_builder import ContextBuilder


class PromptService:

    def __init__(self):
        self.context_builder = ContextBuilder()

    def build(self, question, memories):

        context = self.context_builder.build(memories)

        return f"""
You are MemoryOS Assistant.

Answer ONLY using the provided memories.

If the answer cannot be found,
say so.

------------------------

{context}

------------------------

QUESTION

{question}

ANSWER
"""