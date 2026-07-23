const DEFAULT_MAX_CONTEXT_CHARS = Number(process.env.RAG_MAX_CONTEXT_CHARS || 12000);
const DEFAULT_MAX_CONTENT_CHARS = Number(process.env.RAG_MAX_CONTENT_CHARS_PER_MEMORY || 1600);
const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") console.info("[RAG context]", ...details);
};

class ContextService {
  constructor({ maxContextChars = DEFAULT_MAX_CONTEXT_CHARS, maxContentChars = DEFAULT_MAX_CONTENT_CHARS } = {}) {
    this.maxContextChars = maxContextChars;
    this.maxContentChars = maxContentChars;
  }

  /** Build a bounded, model-ready representation of retrieved memories. */
  build(memories) {
    debug("INPUT", { memoryCount: memories.length, maxContextChars: this.maxContextChars, maxContentChars: this.maxContentChars });
    const sources = [];
    const sections = [];
    let usedChars = 0;

    for (const memory of memories) {
      const relevantContent = this.#truncate(memory.content || memory.summary, this.maxContentChars);
      const section = [
        `Source: ${memory.fileName}`,
        `Category: ${memory.category}`,
        `Summary: ${memory.summary || "Not available"}`,
        `Relevant content: ${relevantContent || "Not available"}`,
        `Similarity: ${memory.similarity}`,
      ].join("\n");

      if (usedChars + section.length > this.maxContextChars) {
        debug("LIMIT REACHED", { usedChars, nextSectionLength: section.length });
        break;
      }
      sections.push(section);
      usedChars += section.length + 2;
      sources.push({ id: memory.id, fileName: memory.fileName, similarity: memory.similarity });
    }

    const context = sections.join("\n\n---\n\n");
    debug("OUTPUT", { contextLength: context.length, sourceCount: sources.length });
    return { context, sources };
  }

  #truncate(value, limit) {
    const text = String(value || "").trim();
    return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
  }
}

module.exports = new ContextService();
module.exports.ContextService = ContextService;
