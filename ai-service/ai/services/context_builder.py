class ContextBuilder:

    def build(self, memories):

        sections = []

        for i, memory in enumerate(memories, start=1):

            sections.append(

f"""
========== MEMORY {i} ==========

ID:
{memory.id}

TITLE:
{memory.title}

CATEGORY:
{memory.category}

SUMMARY:
{memory.summary}

CONTENT:
{memory.content}
"""
            )

        return "\n".join(sections)