const DEFAULT_TOP_K = Number(
  process.env.RETRIEVAL_TOP_K || 5
);

const MIN_FINAL_SCORE = Number(
  process.env.RERANK_MIN_SCORE || 0.25
);

const WEIGHTS = {
  semantic: Number(process.env.WEIGHT_SEMANTIC || 0.55),

  filename: Number(process.env.WEIGHT_FILENAME || 0.20),

  keyword: Number(process.env.WEIGHT_KEYWORD || 0.10),

  category: Number(process.env.WEIGHT_CATEGORY || 0.05),

  tag: Number(process.env.WEIGHT_TAG || 0.10),
};

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[Reranker]", ...details);
  }
};

class Reranker {
  async rank({ query, candidates }) {
    if (!Array.isArray(candidates)) {
      throw new Error("Candidates must be an array.");
    }

    if (candidates.length === 0) {
      return [];
    }

    const ranked = candidates.map((candidate) => {
      const finalScore = this.calculateScore(candidate);

      return {
        ...candidate,

        finalScore: Number(
          finalScore.toFixed(4)
        ),
      };
    });

    ranked.sort(
        (a, b) => b.finalScore - a.finalScore
        );

        const filtered = ranked.filter(
        (candidate) => candidate.finalScore >= MIN_FINAL_SCORE
        );

        debug({
        beforeFiltering: ranked.length,
        afterFiltering: filtered.length,
        minimumScore: MIN_FINAL_SCORE,
        ranked: filtered.map((candidate) => ({
            file: candidate.fileName,
            score: candidate.finalScore,
            semantic: candidate.semanticScore,
            filename: candidate.filenameScore,
            keyword: candidate.keywordScore,
            category: candidate.categoryScore,
            tag: candidate.tagScore,
        })),
    });

        return filtered.slice(0, DEFAULT_TOP_K);
}

    calculateScore(candidate) {
    return (
      candidate.semanticScore *
        WEIGHTS.semantic +

      candidate.filenameScore *
        WEIGHTS.filename +

      candidate.keywordScore *
        WEIGHTS.keyword +

      candidate.categoryScore *
        WEIGHTS.category +

      candidate.tagScore *
        WEIGHTS.tag
    );
  }
}

module.exports = new Reranker();
module.exports.Reranker = Reranker;