const aiService = require("../ai.service");

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[RAG Embedding Service]", ...details);
  }
};

class EmbeddingService {
  constructor({ aiClient = aiService } = {}) {
    this.aiClient = aiClient;
  }

  /**
   * Generate embedding for a search query.
   *
   * @param {string} text
   * @returns {Promise<number[]>}
   */
  async generate(text) {
    // -------------------------------
    // Validate Input
    // -------------------------------
    if (typeof text !== "string" || !text.trim()) {
      const error = new Error("Text is required to generate an embedding.");
      error.status = 400;
      throw error;
    }

    try {
      debug("INPUT", {
        textLength: text.length,
        next: "FastAPI /embedding",
      });

      const embedding = await this.aiClient.generateEmbedding(text.trim());

      // -------------------------------
      // Validate Response
      // -------------------------------
      if (!Array.isArray(embedding)) {
        throw new Error("Embedding response is not an array.");
      }

      const EXPECTED = 1024;

      if (embedding.length !== EXPECTED) {
          throw new Error(
              `Expected ${EXPECTED} dimensions but received ${embedding.length}`
          );
      }

      if (embedding.some((value) => typeof value !== "number")) {
        throw new Error("Embedding contains invalid values.");
      }

      debug("OUTPUT", {
        dimensions: embedding.length,
        preview: embedding.slice(0, 5),
      });

      return embedding;
    } catch (error) {
      debug("ERROR", {
        message: error.message,
        status: error.response?.status || error.status,
      });

      // Preserve validation errors
      if (error.status === 400) {
        throw error;
      }

      console.error("[EmbeddingService]", error);

      const serviceError = new Error(
        "Unable to generate embedding from AI service."
      );

      serviceError.status = 502;

      throw serviceError;
    }
  }
}

module.exports = new EmbeddingService();
module.exports.EmbeddingService = EmbeddingService;