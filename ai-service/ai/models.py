from transformers import AutoTokenizer
from transformers import AutoModelForSeq2SeqLM

print("Loading Summarization Model...")

MODEL_NAME = "sshleifer/distilbart-cnn-12-6"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

print("Summarization Model Loaded.")