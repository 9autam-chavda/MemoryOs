from ai.providers.embedding.jina_provider import (
    generate_embedding as jina_generate_embedding,
)


def generate_embedding(text: str):

    text = text.strip()

    if not text:
        return []

    return jina_generate_embedding(text)