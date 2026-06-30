from transformers import AutoTokenizer
from transformers import AutoModelForSeq2SeqLM
from sentence_transformers import SentenceTransformer


class ModelManager:

    def __init__(self):
        print("Loading AI Models...")

        self.summary_model = None
        self.summary_tokenizer = None
        self.embedding_model = None

        self.load_summary_model()
        self.load_embedding_model()

        print("✓ AI Models Loaded.")

    def load_summary_model(self):

        model_name = "sshleifer/distilbart-cnn-12-6"

        self.summary_tokenizer = AutoTokenizer.from_pretrained(
            model_name
        )

        self.summary_model = AutoModelForSeq2SeqLM.from_pretrained(
            model_name
        )

    def load_embedding_model(self):

        print("Loading Embedding Model...")

        self.embedding_model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        print("✓ Embedding Model Loaded.")


model_manager = ModelManager()