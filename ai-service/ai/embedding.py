from ai.model_manager import model_manager


def generate_embedding(text: str):

    text = text.strip()

    if not text:
        return []

    embedding = model_manager.embedding_model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding.tolist()