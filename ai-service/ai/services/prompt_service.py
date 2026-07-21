class PromptService:

    def build(
        self,
        question: str,
        context: str
    ) -> str:

        return f"""
You are MemoryOS.

You answer ONLY using the memories provided.

Rules:

- Never invent information.
- If the answer is unavailable,
  clearly say you couldn't find it.
- Mention the source filenames.
- Be concise.
- Respond using Markdown.

Question:

{question}

Context:

{context}
"""