const extract = async (file) => {
  const extractedText = file.buffer.toString("utf8").trim();

  return {
    extractedText,
    wordCount: extractedText
      ? extractedText.split(/\s+/).length
      : 0,
    pageCount: 1,
  };
};

module.exports = {
  extract,
};