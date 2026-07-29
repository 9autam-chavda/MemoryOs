const queryAnalyzer = require("./queryAnalyzer");
const hybridRetriever = require("./hybridRetriever");
const reranker = require("./reranker");
const contextBuilder = require("./contextBuilder");
const promptBuilder = require("./promptBuilder");
const responseGenerator = require("./responseGenerator");

class AssistantPipeline {
  async process({ question, userId, history = [] }) {
    if (!question?.trim()) {
      throw new Error("Question is required.");
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }

    // 1. Analyze the query
    const analyzedQuery = await queryAnalyzer.analyze(question);

    // 2. Retrieve candidate memories
    const candidates = await hybridRetriever.retrieve({
        query: analyzedQuery,
        userId,
    });

    // 3. Rerank candidates
    const rankedMemories = await reranker.rank({
      query: analyzedQuery,
      candidates,
    });

    // 4. Build context
    const context = await contextBuilder.build(rankedMemories);

    // 5. Build prompt
    const prompt = await promptBuilder.build({
      question,
      context,
      history,
    });

    // 6. Generate AI response
    const answer = await responseGenerator.generate(prompt);

    return {
      answer,
      memories: rankedMemories,
      prompt, // remove this in production if you don't need debugging
    };
  }
}

module.exports = new AssistantPipeline();
module.exports.AssistantPipeline = AssistantPipeline;