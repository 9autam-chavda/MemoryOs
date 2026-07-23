from ai.services.context_builder import ContextBuilder


class PromptService:

    def __init__(self):
        self.context_builder = ContextBuilder()

    def build(
        self,
        question,
        memories,
        history,
    ):

        context = self.context_builder.build(memories)

        conversation = self._build_history(history)

        return f"""
You are MemoryOS Assistant.

You help users answer questions using ONLY their uploaded memories.

==============================
CONVERSATION HISTORY
==============================

{conversation}

==============================
RELEVANT MEMORIES
==============================

{context}

==============================
CURRENT QUESTION
==============================

{question}

==============================
RULES
==============================

1. Answer ONLY from the provided memories.
2. Use the conversation history for context when resolving follow-up questions like:
   - "Explain more."
   - "Summarize the second one."
   - "What about that document?"
3. If the answer cannot be found in the memories, clearly say so.
4. Never invent information.
5. Keep the response concise and helpful.

ANSWER:
"""

    def _build_history(self, history):

        if not history:
            return "No previous conversation."

        lines = []

        for message in history:
            role = message.role.capitalize()
            lines.append(f"{role}: {message.content}")

        return "\n".join(lines)