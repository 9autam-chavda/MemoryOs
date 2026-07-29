const AssistantPipeline = require("./assistant.pipeline");

const queryAnalyzer = require("./queryAnalyzer");
const hybridRetriever = require("./hybridRetriever");
const reranker = require("./reranker");
const contextBuilder = require("./contextBuilder");
const promptBuilder = require("./promptBuilder");
const responseGenerator = require("./responseGenerator");

module.exports = new AssistantPipeline({
  queryAnalyzer,
  hybridRetriever,
  reranker,
  contextBuilder,
  promptBuilder,
  responseGenerator,
});