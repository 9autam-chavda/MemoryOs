from ai.model_manager import model_manager


def summarize(text: str) -> str:

    text = text.strip()

    if not text:
        return ""

    try:

        inputs = model_manager.summary_tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=1024,
        )

        summary_ids = model_manager.summary_model.generate(
            **inputs,
            max_length=80,
            min_length=20,
            num_beams=4,
            early_stopping=True,
        )

        return model_manager.summary_tokenizer.decode(
            summary_ids[0],
            skip_special_tokens=True,
        )

    except Exception as e:

        print(f"Summarization Error: {e}")

        return ""