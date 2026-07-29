const axios = require("axios");

const AI_BASE_URL = (
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const client = axios.create({
  baseURL: AI_BASE_URL,
  timeout: Number(process.env.AI_TIMEOUT || 60000),
});

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[AI Service]", ...details);
  }
};

// ===========================================
// Analyze Text
// ===========================================

const analyzeText = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required for analysis.");
  }

  debug("REQUEST", {
    endpoint: "/analyze",
    textLength: text.length,
  });

  const { data } = await client.post("/analyze", {
    text,
  });

  debug("RESPONSE", {
    endpoint: "/analyze",
    success: data.success,
  });

  return {
    summary: data.summary,
    category: data.category,
    tags: data.tags,
    embedding: data.embedding,
  };
};

// ===========================================
// Generate Embedding
// ===========================================

const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required for embedding.");
  }

  debug("REQUEST", {
    endpoint: "/embedding",
    textLength: text.length,
  });

  const { data } = await client.post("/embedding", {
    text,
  });

  debug("RESPONSE", {
    endpoint: "/embedding",
    dimensions: data.embedding?.length,
  });

  return data.embedding;
};

module.exports = {
  analyzeText,
  generateEmbedding,
};