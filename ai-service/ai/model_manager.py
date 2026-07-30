from sentence_transformers import SentenceTransformer


class ModelManager:

    def __init__(self):
        print("Loading AI Models...")

        self.summary_model = None

        self.load_embedding_model()

        print("✓ AI Models Loaded.")


    def load_embedding_model(self):

        print("Loading Embedding Model...")

        self.embedding_model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        print("✓ Embedding Model Loaded.")


model_manager = ModelManager()