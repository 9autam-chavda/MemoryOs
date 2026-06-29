from ai.models import tokenizer, model


def summarize(text: str) -> str:

    text = text.strip()

    if not text:
        return ""

    try:

        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=1024,
        )

        summary_ids = model.generate(
            **inputs,
            max_length=80,
            min_length=20,
            num_beams=4,
            early_stopping=True,
        )

        return tokenizer.decode(
            summary_ids[0],
            skip_special_tokens=True,
        )

    except Exception as e:

        print(e)

        return ""