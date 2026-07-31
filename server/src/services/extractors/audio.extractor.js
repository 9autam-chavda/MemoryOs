const aiService = require("../ai.service");

const extract = async (file) => {
  const text = await aiService.transcribeFile(file);

  return {
    extractedText: text,
    wordCount: text ? text.split(/\s+/).length : 0,
  };
};

module.exports = { extract };