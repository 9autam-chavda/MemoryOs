import re


STOP_WORDS = {
    "the",
    "is",
    "and",
    "of",
    "to",
    "a",
    "in",
    "for",
    "on",
    "with",
    "at",
    "by"
}


def extract_tags(text: str):

    words = re.findall(r"[A-Za-z0-9]+", text)

    tags = []

    for word in words:

        if len(word) < 3:
            continue

        if word.lower() in STOP_WORDS:
            continue

        if word not in tags:
            tags.append(word)

        if len(tags) == 5:
            break

    return tags