const MemoryItem = require("../../models/MemoryItem");
const embeddingService = require("./embedding.service");
const cosineSimilarity = require("../../utils/cosineSimilarity");

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[RAG Retrieval Service]", ...details);
  }
};

const DEFAULT_TOP_K = Number(process.env.RETRIEVAL_TOP_K || 5);
const DEFAULT_THRESHOLD = Number(process.env.RETRIEVAL_THRESHOLD || 0.30);

class RetrievalService {
  constructor({
    memoryModel = MemoryItem,
    embeddings = embeddingService,
    similarity = cosineSimilarity,
  } = {}) {
    this.memoryModel = memoryModel;
    this.embeddings = embeddings;
    this.similarity = similarity;
  }

  async retrieve(question, userId, options = {}) {
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

    const topK = Math.max(
      1,
      Number(options.topK ?? DEFAULT_TOP_K) || DEFAULT_TOP_K
    );

    const threshold = Number(
      options.threshold ?? DEFAULT_THRESHOLD
    );

    debug("INPUT", {
      userId,
      questionLength: question.length,
      topK,
      threshold,
    });

    const queryEmbedding = await this.embeddings.generate(question);

    if (
      !Array.isArray(queryEmbedding) ||
      queryEmbedding.length !== 384
    ) {
      throw new Error("Invalid query embedding.");
    }

    debug("QUERY EMBEDDING", {
      dimensions: queryEmbedding.length,
    });

    const memories = await this.memoryModel.find({
      userId,
      processingStatus: "completed",
      embedding: {
        $exists: true,
        $ne: [],
      },
    })
      .select(
        "fileName fileType summary category extractedText embedding createdAt"
      )
      .lean();

    debug("DATABASE", {
      retrieved: memories.length,
    });

    const scored = [];

    for (const memory of memories) {
      if (
        !Array.isArray(memory.embedding) ||
        memory.embedding.length !== 384
      ) {
        continue;
      }

      let similarity;

      try {
        similarity = this.similarity(
          queryEmbedding,
          memory.embedding
        );
      } catch {
        continue;
      }

      scored.push({
        id: memory._id.toString(),
        title: memory.fileName,
        fileName: memory.fileName,
        fileType: memory.fileType,
        summary: memory.summary || "",
        category: memory.category || "Uncategorized",
        content: memory.extractedText || "",
        createdAt: memory.createdAt,
        similarity,
      });
    }

    const results = scored
      .filter(
        (memory) =>
          Number.isFinite(memory.similarity) &&
          memory.similarity >= threshold
      )
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map((memory) => ({
        ...memory,
        similarity: Number(memory.similarity.toFixed(4)),
      }));

    debug("RESULT", {
      retrieved: results.length,
      similarities: results.map((m) => ({
        file: m.fileName,
        similarity: m.similarity,
      })),
    });

    return results;
  }
}

module.exports = new RetrievalService();
module.exports.RetrievalService = RetrievalService;