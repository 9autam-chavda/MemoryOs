def summarize(text: str) -> str:

    text = text.strip()

    if not text:
        return ""

    sentences = text.split(".")

    return sentences[0].strip() + "."