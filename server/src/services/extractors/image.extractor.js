const Tesseract = require("tesseract.js");

const extract = async (file) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(file.buffer, "eng");

    const extractedText = text
      .replace(/\s+/g, " ")
      .trim();

    const wordCount = extractedText
      ? extractedText.split(/\s+/).length
      : 0;

    return {
      extractedText,
      wordCount,
    };

  } catch (error) {

    console.error("OCR Error:", error);

    return {
      extractedText: "",
      wordCount: 0,
    };

  }
};

module.exports = {
  extract,
};