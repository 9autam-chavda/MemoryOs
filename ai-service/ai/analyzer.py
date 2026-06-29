from ai.summarizer import summarize
from ai.classifier import classify
from ai.tagger import extract_tags


def analyze(text: str):

    return {

        "summary": summarize(text),

        "category": classify(text),

        "tags": extract_tags(text)

    }