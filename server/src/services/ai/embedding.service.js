import axios from "axios";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

class EmbeddingService {
    async generate(text) {
        if (!text || !text.trim()) {
            throw new Error("Text is required to generate embedding.");
        }

        try {
            const response = await axios.post(
                `${AI_SERVICE_URL}/embedding`,
                { text }
            );

            return response.data.embedding;
        } catch (error) {
            console.error("Embedding Service Error:", error.message);

            throw new Error("Unable to generate embedding.");
        }
    }
}

export default new EmbeddingService();