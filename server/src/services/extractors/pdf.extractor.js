const pdf = require("pdf-parse");

const extract = async (file) => {

  const data = await pdf(file.buffer);

  const extractedText = data.text.trim();

  return {
    extractedText,
    wordCount: extractedText
      ? extractedText.split(/\s+/).length
      : 0,
  };

};

module.exports = {
  extract,
};