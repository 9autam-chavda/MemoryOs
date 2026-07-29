const assistantPipeline = require("./ai/pipeline/assistant.pipeline");
const memorySessionService = require("./memorySession.service");

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[RAG Assistant Service]", ...details);
  }
};

class AssistantService {
    constructor({
    pipeline = assistantPipeline,
    sessionService = memorySessionService,
    model = process.env.LLM_MODEL || "gemini-2.5-flash",
  } = {}) {
    this.pipeline = pipeline;
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

    let result;

    try {
      result = await this.pipeline.process({
        question,
        userId,
        history,
      });
    } catch (error) {
      console.error("[Assistant Pipeline]", error);

      const serviceError = new Error(
        "Unable to generate assistant response."
      );

      serviceError.status = 502;

      throw serviceError;
    }

    const answer = result.answer;
    const memories = result.memories || [];


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
        id: memory._id,
        title: memory.fileName,
        fileType: memory.fileType,
        score: memory.finalScore,
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
        id: memory._id,
        title: memory.fileName,
        fileType: memory.fileType,
        score: memory.finalScore,
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
