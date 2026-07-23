const retrievalService = require("./ai/retrieval.service");
const aiService = require("./ai.service");

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[RAG Assistant Service]", ...details);
  }
};

class AssistantService {
  constructor({
    retrieval = retrievalService,
    aiClient = aiService,
    model = process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free",
  } = {}) {
    this.retrieval = retrieval;
    this.aiClient = aiClient;
    this.model = model;
  }

  /**
   * Execute the complete RAG pipeline.
   */
  async process(question, userId) {
    const startedAt = Date.now();

    // -------------------------
    // Validate Input
    // -------------------------
    if (typeof question !== "string" || !question.trim()) {
      const error = new Error("Question is required.");
      error.status = 400;
      throw error;
    }

    if (!userId) {
      const error = new Error("User ID is required.");
      error.status = 401;
      throw error;
    }

    debug("INPUT", {
      questionLength: question.length,
      userId,
    });

    // -------------------------
    // Retrieve Memories
    // -------------------------
    const memories = await this.retrieval.retrieve(
      question,
      userId
    );

    debug("RETRIEVAL", {
      memories: memories.length,
    });

    if (memories.length === 0) {
      return this.#response(
        "I couldn't find anything related to your question in your uploaded memories.",
        [],
        startedAt
      );
    }

    // -------------------------
    // Ask AI Service
    // -------------------------
    let response;

    try {

      response = await this.aiClient.askAssistant({
        question: question.trim(),
        memories,
      });

    } catch (error) {

      console.error("[AssistantService]", error);

      const serviceError = new Error(
        "Unable to generate assistant response."
      );

      serviceError.status = 502;

      throw serviceError;
    }

    const answer = response?.answer;

    if (
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      throw new Error("Invalid answer returned.");
    }

    return this.#response(
      answer,
      memories,
      startedAt
    );
  }

  #response(answer, memories, startedAt) {
    return {
      success: true,

      answer,

      sources: memories.map((memory) => ({
        id: memory.id,
        title: memory.title,
        similarity: memory.similarity,
      })),

      metadata: {
        model: this.model,
        retrievedMemories: memories.length,
        responseTime: Date.now() - startedAt,
      },
    };
  }
}

module.exports = new AssistantService();
module.exports.AssistantService = AssistantService;