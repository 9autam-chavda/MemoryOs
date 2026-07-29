const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "to",
  "of",
  "for",
  "in",
  "on",
  "my",
  "me",
  "please",
  "show",
  "find",
  "give",
  "tell",
  "about",
]);

const INTENTS = {
  DOCUMENT_LOOKUP: "document_lookup",
  KNOWLEDGE_LOOKUP: "knowledge_lookup",
  MEMORY_SEARCH: "memory_search",
  TIMELINE: "timeline",
  SUMMARY: "summary",
  COMPARISON: "comparison",
  UNKNOWN: "unknown",
};

class QueryAnalyzer {
  analyze(question) {
    if (!question || typeof question !== "string") {
      throw new Error("Question is required.");
    }

    const normalizedQuery = question
      .trim()
      .toLowerCase();

    const keywords = this.extractKeywords(normalizedQuery);

    const intent = this.detectIntent(
      normalizedQuery,
      keywords
    );

    const filters = this.detectFilters(
      normalizedQuery
    );

    return {
      originalQuery: question,
      normalizedQuery,
      keywords,
      intent,
      filters,
    };
  }

  extractKeywords(query) {
    return query
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 &&
          !STOP_WORDS.has(word)
      );
  }

  detectIntent(query, keywords) {
    if (
      /(pdf|document|file|report|invoice|resume|notes)/.test(
        query
      )
    ) {
      return INTENTS.DOCUMENT_LOOKUP;
    }

    if (
      /(summarize|summary)/.test(query)
    ) {
      return INTENTS.SUMMARY;
    }

    if (
      /(compare|difference)/.test(query)
    ) {
      return INTENTS.COMPARISON;
    }

    if (
      /(yesterday|today|last|recent)/.test(
        query
      )
    ) {
      return INTENTS.TIMELINE;
    }

    if (
      /(what|how|why|when|where|who)/.test(
        query
      )
    ) {
      return INTENTS.KNOWLEDGE_LOOKUP;
    }

    if (keywords.length > 0) {
      return INTENTS.MEMORY_SEARCH;
    }

    return INTENTS.UNKNOWN;
  }

  detectFilters(query) {
    const filters = {};

    if (query.includes("pdf"))
      filters.fileType = "pdf";

    if (query.includes("image"))
      filters.fileType = "image";

    if (query.includes("video"))
      filters.fileType = "video";

    if (query.includes("audio"))
      filters.fileType = "audio";

    return filters;
  }
}

module.exports = new QueryAnalyzer();