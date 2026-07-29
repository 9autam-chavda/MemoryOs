const MAX_MEMORIES = Number(
  process.env.CONTEXT_MAX_MEMORIES || 5
);

const MAX_CONTENT = Number(
  process.env.CONTEXT_MAX_CONTENT || 1200
);

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[Context Builder]", ...details);
  }
};

class ContextBuilder {
  async build(memories) {
    if (!Array.isArray(memories)) {
      throw new Error("Memories must be an array.");
    }

    const selected = memories.slice(0, MAX_MEMORIES);

    const sections = [];

    for (const memory of selected) {
      sections.push(
        this.buildMemory(memory)
      );
    }

    const context = sections.join(
      "\n\n----------------------------------------\n\n"
    );

    debug({
      memories: selected.length,
      contextLength: context.length,
    });

    return context;
  }

    buildMemory(memory) {
    return `
MEMORY

Filename:
${memory.fileName}

File Type:
${memory.fileType}

Category:
${memory.category || "Unknown"}

Tags:
${this.buildTags(memory.tags)}

Relevance Score:
${memory.finalScore}

Summary:
${memory.summary || "Not Available"}

Relevant Content:
${this.extractRelevantContent(memory)}
`;
  }

    buildTags(tags) {
    if (!Array.isArray(tags)) {
      return "None";
    }

    if (tags.length === 0) {
      return "None";
    }

    return tags.join(", ");
  }

    extractRelevantContent(memory) {
    const text =
      memory.extractedText ||
      memory.content ||
      "";

    if (!text) {
      return "Not Available";
    }

    if (text.length <= MAX_CONTENT) {
      return text;
    }

    return text.substring(0, MAX_CONTENT) + "...";
  }

}

module.exports = new ContextBuilder();
module.exports.ContextBuilder = ContextBuilder;