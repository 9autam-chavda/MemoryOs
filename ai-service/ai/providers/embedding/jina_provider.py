import os
import requests

API_KEY = os.getenv("JINA_API_KEY")
MODEL = os.getenv("JINA_MODEL", "jina-embeddings-v3")
URL = "https://api.jina.ai/v1/embeddings"


def generate_embedding(text: str):

    text = text.strip()

    if not text:
        return []

    if not API_KEY:
        raise RuntimeError("JINA_API_KEY is not configured.")

    try:
        response = requests.post(
            URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": MODEL,
                "input": [text],
            },
            timeout=30,
        )

        response.raise_for_status()

        data = response.json()

        if "data" not in data or not data["data"]:
            raise RuntimeError("Invalid response from Jina API.")

        return data["data"][0]["embedding"]

    except requests.RequestException as e:
        raise RuntimeError(f"Failed to generate embedding: {e}") from e