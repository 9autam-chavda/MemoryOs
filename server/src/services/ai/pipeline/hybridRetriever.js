const MemoryItem = require("../../../models/MemoryItem");
const embeddingService = require("../embedding.service");
const cosineSimilarity = require("../../../utils/cosineSimilarity");

const DEFAULT_LIMIT = Number(process.env.RETRIEVAL_CANDIDATE_LIMIT || 20);
const MIN_SIMILARITY = Number(
  process.env.SEMANTIC_MIN_SCORE || 0.35
);

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[Hybrid Retriever]", ...details);
  }
};

class HybridRetriever {
  constructor({
    memoryModel = MemoryItem,
    embeddings = embeddingService,
  } = {}) {
    this.memoryModel = memoryModel;
    this.embeddings = embeddings;
  }

  async retrieve({ query, userId }) {
    if (!query) {
      throw new Error("Query is required.");
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }

    debug("INPUT", {
      query: query.normalizedQuery,
      intent: query.intent,
      keywords: query.keywords,
    });

    const [
      semanticResults,
      filenameResults,
      keywordResults,
      categoryResults,
      tagResults,
    ] = await Promise.all([
      this.semanticSearch(query, userId),
      this.filenameSearch(query, userId),
      this.keywordSearch(query, userId),
      this.categorySearch(query, userId),
      this.tagSearch(query, userId),
    ]);

    const merged = this.mergeResults([
      semanticResults,
      filenameResults,
      keywordResults,
      categoryResults,
      tagResults,
    ]);

    debug("RESULT", {
      semantic: semanticResults.length,
      filename: filenameResults.length,
      keyword: keywordResults.length,
      category: categoryResults.length,
      tag: tagResults.length,
      merged: merged.length,
    });

    return merged.slice(0, DEFAULT_LIMIT);
  }
  async semanticSearch(query, userId) {
    const queryEmbedding = await this.embeddings.generate(
      query.normalizedQuery
    );

    const EXPECTED = Number(
      process.env.EMBEDDING_DIMENSION || 1024
    );

    if (
      !Array.isArray(queryEmbedding) ||
      queryEmbedding.length !== EXPECTED
    ) {
      throw new Error("Invalid query embedding.");
    }

    const memories = await this.memoryModel
      .find({
        userId,
        processingStatus: "completed",
        embedding: {
          $exists: true,
          $ne: [],
        },
      })
      .lean();

    const results = [];

    for (const memory of memories) {
      // Skip invalid embeddings
      if (
        !Array.isArray(memory.embedding) ||
        memory.embedding.length !== EXPECTED
      ) {
        continue;
      }

      let similarity = 0;

      try {
        similarity = cosineSimilarity(
          queryEmbedding,
          memory.embedding
        );
      } catch {
        continue;
      }

      if (similarity >= MIN_SIMILARITY) {
        results.push({
            memory,

            semanticScore: similarity,

            filenameScore: 0,
            keywordScore: 0,
            categoryScore: 0,
            tagScore: 0,

            source: "semantic",
        });
      }
    }

    debug("SEMANTIC SEARCH", {
    threshold: MIN_SIMILARITY,
    candidates: results.length,
    });

    return results;
  }
  /**
   * Escape regex special characters
   */
  escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Build regex from extracted keywords
   */
  buildKeywordRegex(keywords) {
    if (!Array.isArray(keywords) || keywords.length === 0) {
      return null;
    }

    const escaped = keywords
      .map((keyword) => this.escapeRegex(keyword))
      .filter(Boolean);

    if (escaped.length === 0) {
      return null;
    }

    return new RegExp(escaped.join("|"), "i");
  }

  /**
   * Filename Search
   */
  async filenameSearch(query, userId) {
    const regex = this.buildKeywordRegex(query.keywords);

    if (!regex) {
      return [];
    }

    const memories = await this.memoryModel
      .find({
        userId,
        processingStatus: "completed",
        fileName: regex,
      })
      .lean();

    debug("FILENAME SEARCH", {
      candidates: memories.length,
    });

    return memories.map((memory) => ({
      memory,

      semanticScore: 0,

      filenameScore: 1,

      keywordScore: 0,

      categoryScore: 0,

      tagScore: 0,

      source: "filename",
    }));
  }

  /**
   * Keyword Search
   */
  async keywordSearch(query, userId) {
    const regex = this.buildKeywordRegex(query.keywords);

    if (!regex) {
      return [];
    }

    const memories = await this.memoryModel
      .find({
        userId,
        processingStatus: "completed",
        extractedText: regex,
      })
      .lean();

    debug("KEYWORD SEARCH", {
      candidates: memories.length,
    });

    return memories.map((memory) => ({
      memory,

      semanticScore: 0,

      filenameScore: 0,

      keywordScore: 1,

      categoryScore: 0,

      tagScore: 0,

      source: "keyword",
    }));
  }
  /**
   * Category Search
   */
  async categorySearch(query, userId) {
    const regex = this.buildKeywordRegex(query.keywords);

    if (!regex) {
      return [];
    }

    const memories = await this.memoryModel
      .find({
        userId,
        processingStatus: "completed",
        category: regex,
      })
      .lean();

    debug("CATEGORY SEARCH", {
      candidates: memories.length,
    });

    return memories.map((memory) => ({
      memory,

      semanticScore: 0,
      filenameScore: 0,
      keywordScore: 0,
      categoryScore: 1,
      tagScore: 0,

      source: "category",
    }));
  }
  /**
   * Tag Search
   */
  async tagSearch(query, userId) {
    if (
      !Array.isArray(query.keywords) ||
      query.keywords.length === 0
    ) {
      return [];
    }

    const memories = await this.memoryModel
      .find({
        userId,
        processingStatus: "completed",
        tags: {
          $in: query.keywords,
        },
      })
      .lean();

    debug("TAG SEARCH", {
      candidates: memories.length,
    });

    return memories.map((memory) => ({
      memory,

      semanticScore: 0,
      filenameScore: 0,
      keywordScore: 0,
      categoryScore: 0,
      tagScore: 1,

      source: "tag",
    }));
  }
  /**
   * Merge duplicate memories from multiple retrieval strategies.
   */
  mergeResults(resultSets) {
    const merged = new Map();

    for (const results of resultSets) {
      for (const candidate of results) {
        const id = candidate.memory._id.toString();

        if (!merged.has(id)) {
          merged.set(id, {
            ...candidate.memory,

            semanticScore: 0,
            filenameScore: 0,
            keywordScore: 0,
            categoryScore: 0,
            tagScore: 0,

            matchedSources: [],
          });
        }

        const current = merged.get(id);

        current.semanticScore = Math.max(
          current.semanticScore,
          candidate.semanticScore
        );

        current.filenameScore = Math.max(
          current.filenameScore,
          candidate.filenameScore
        );

        current.keywordScore = Math.max(
          current.keywordScore,
          candidate.keywordScore
        );

        current.categoryScore = Math.max(
          current.categoryScore,
          candidate.categoryScore
        );

        current.tagScore = Math.max(
          current.tagScore,
          candidate.tagScore
        );

        if (
          !current.matchedSources.includes(candidate.source)
        ) {
          current.matchedSources.push(candidate.source);
        }
      }
    }

    return [...merged.values()];
  }
}

module.exports = new HybridRetriever();
module.exports.HybridRetriever = HybridRetriever;