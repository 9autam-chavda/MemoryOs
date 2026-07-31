const axios = require("axios");
const handleAIError = require("../utils/aiErrorHandler");
const FormData = require("form-data");

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

  let data;

  try {
    const response = await client.post("/analyze", {
      text,
    });

    data = response.data;
  } catch (error) {
    handleAIError(error, "analyze the document");
  }

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

  let data;

  try {
    const response = await client.post("/embedding", {
      text,
    });

    data = response.data;
  } catch (error) {
    handleAIError(error, "generate embeddings");
  }

  debug("RESPONSE", {
    endpoint: "/embedding",
    dimensions: data.embedding?.length,
  });

  return data.embedding;
};

// ===========================================
// Generate Summary
// ===========================================

const generateSummary = async (text) => {
  if (!text || !text.trim()) {
    return "";
  }

  debug("REQUEST", {
    endpoint: "/summary",
    textLength: text.length,
  });

  let data;

  try {
    const response = await client.post("/summary", {
      text,
    });

    data = response.data;
  } catch (error) {
    handleAIError(error, "generate summary");
  }

  debug("RESPONSE", {
    endpoint: "/summary",
  });

  return data.summary;
};

// ===========================================
// Transcribe File
// ===========================================

const transcribeFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  debug("REQUEST", {
    endpoint: "/transcribe",
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  });

  try {
    const response = await client.post(
      "/transcribe",
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    debug("RESPONSE", {
      endpoint: "/transcribe",
      textLength: response.data.text?.length || 0,
    });

    return response.data.text || "";
  } catch (error) {
    handleAIError(error, "transcribe the file");
  }
};

module.exports = {
  analyzeText,
  generateEmbedding,
  generateSummary,
  transcribeFile,
};