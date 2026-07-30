from ai.classifier import classify
from ai.tagger import extract_tags
from ai.embedding import generate_embedding


def analyze(text: str):

    category = classify(text)

    tags = extract_tags(text)

    embedding = generate_embedding(text)

    return {
        "summary": "",
        "category": category,
        "tags": tags,
        "embedding": embedding,
    }