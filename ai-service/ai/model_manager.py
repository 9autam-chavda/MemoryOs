from transformers import AutoTokenizer
from transformers import AutoModelForSeq2SeqLM


class ModelManager:

    def __init__(self):
        print("Loading AI Models...")

        self.MODEL_NAME = "sshleifer/distilbart-cnn-12-6"

        self.summary_tokenizer = AutoTokenizer.from_pretrained(
            self.MODEL_NAME
        )

        self.summary_model = AutoModelForSeq2SeqLM.from_pretrained(
            self.MODEL_NAME
        )

        print("✓ AI Models Loaded.")


model_manager = ModelManager()