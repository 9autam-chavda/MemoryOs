const axios = require("axios");

const AI_BASE_URL = (
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[RAG AI Client]", ...details);
  }
};

// ===========================================
// Analyze Text
// ===========================================

const analyzeText = async (text) => {
  const response = await axios.post(
    `${AI_BASE_URL}/analyze`,
    { text }
  );

  return response.data;
};

// ===========================================
// Generate Embedding
// ===========================================

const generateEmbedding = async (text) => {
  debug("REQUEST", {
    endpoint: "/embedding",
    textLength: text?.length,
  });

  const response = await axios.post(
    `${AI_BASE_URL}/embedding`,
    { text }
  );

  debug("RESPONSE", {
    dimensions: response.data?.embedding?.length,
  });

  return response.data.embedding;
};

// ===========================================
// Ask MemoryOS Assistant
// ===========================================

const askAssistant = async ({
  question,
  memories,
  history = [],
}) => {

  debug("REQUEST", {
    endpoint: "/assistant",
    questionLength: question?.length,
    memories: memories?.length,
    history: history?.length,
  });

  const response = await axios.post(
    `${AI_BASE_URL}/assistant`,
    {
      question,
      memories,
      history,
    }
  );

  debug("RESPONSE", {
    success: response.data?.success,
    answerLength: response.data?.answer?.length,
  });

  return response.data;
};

module.exports = {
  analyzeText,
  generateEmbedding,
  askAssistant,
};