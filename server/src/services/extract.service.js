const imageExtractor = require("./extractors/image.extractor");
const pdfExtractor = require("./extractors/pdf.extractor");
const audioExtractor = require("./extractors/audio.extractor");
const videoExtractor = require("./extractors/video.extractor");
const textExtractor = require("./extractors/text.extractor");

// ===========================================
// Extract Text Only
// ===========================================

const extractText = async (file, onStage) => {

  const mimeType = file.mimetype;

  let result;

  await onStage?.(
    "extracting",
    "Extracting text..."
  );

  if (mimeType.startsWith("image/")) {

    result = await imageExtractor.extract(file);

  } else if (mimeType === "application/pdf") {

    result = await pdfExtractor.extract(file);

  } else if (mimeType.startsWith("audio/")) {

    result = await audioExtractor.extract(file);

  } else if (mimeType.startsWith("video/")) {

    result = await videoExtractor.extract(file);

  } else if (
    mimeType === "text/plain" ||
    mimeType === "text/markdown"
  ) {

    result = await textExtractor.extract(file);

  } else {

    result = {
      extractedText: "",
      wordCount: 0,
      pageCount: 0,
    };

  }

  return {
    extractedText: result.extractedText || "",
    wordCount: result.wordCount || 0,
    pageCount: result.pageCount || 0,
  };

};

module.exports = {
  extractText,
};