const axios = require("axios");

const AI_BASE_URL = "http://127.0.0.1:8000";

const analyzeText = async (text) => {

  const response = await axios.post(
    `${AI_BASE_URL}/analyze`,
    {
      text,
    }
  );

  return response.data;

};

const generateEmbedding = async (text) => {

  const response = await axios.post(
    `${AI_BASE_URL}/embedding`,
    {
      text,
    }
  );

  return response.data.embedding;

};

module.exports = {
  analyzeText,
  generateEmbedding,
};