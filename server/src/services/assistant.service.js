const retrievalService = require("./ai/retrieval.service");
const aiService = require("./ai.service");
const memorySessionService = require("./memorySession.service");

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[RAG Assistant Service]", ...details);
  }
};

class AssistantService {
  constructor({
    retrieval = retrievalService,
    aiClient = aiService,
    sessionService = memorySessionService,
    model = process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free",
  } = {}) {
    this.retrieval = retrieval;
    this.aiClient = aiClient;
    this.sessionService = sessionService;
    this.model = model;
  }

  async process({
    sessionId,
    question,
    userId,
  }) {
    const startedAt = Date.now();

    if (!sessionId) {
      const error = new Error("Session ID is required.");
      error.status = 400;
      throw error;
    }

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

    question = question.trim();

    debug("INPUT", {
      sessionId,
      userId,
      questionLength: question.length,
    });

    // Validate session
    await this.sessionService.getSessionById(
      sessionId,
      userId
    );

    // Load previous conversation BEFORE saving current question
    const history = (
      await this.sessionService.getRecentMessages(
        sessionId,
        8
      )
    )
    .reverse()
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

    // Save current user message
    await this.sessionService.saveMessage({
      sessionId,
      role: "user",
      content: question,
    });

    // Retrieve relevant memories
    const memories = await this.retrieval.retrieve(
      question,
      userId
    );

    debug("RETRIEVAL", {
      memories: memories.length,
      history: history.length,
    });

    if (memories.length === 0) {
      const answer =
        "I couldn't find anything related to your question in your uploaded memories.";

      await this.sessionService.saveMessage({
        sessionId,
        role: "assistant",
        content: answer,
      });

      return this.#response(
        answer,
        [],
        startedAt
      );
    }

    let response;

    try {
      response = await this.aiClient.askAssistant({
        question,
        memories,
        history,
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
      throw new Error(
        "Invalid answer returned."
      );
    }

    await this.sessionService.saveMessage({
      sessionId,
      role: "assistant",
      content: answer,
      sources: memories.map((memory) => ({
        id: memory.id,
        title: memory.title,
        similarity: memory.similarity,
      })),
      metadata: {
        model: this.model,
        responseTime: Date.now() - startedAt,
      },
    });

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