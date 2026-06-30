const imageExtractor = require("./extractors/image.extractor");
const pdfExtractor = require("./extractors/pdf.extractor");
const audioExtractor = require("./extractors/audio.extractor");
const videoExtractor = require("./extractors/video.extractor");
const textExtractor = require("./extractors/text.extractor");

const aiService = require("./ai.service");

const extractText = async (file) => {

  const mimeType = file.mimetype;

  let result;

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

    throw new Error(
      `Unsupported file type: ${mimeType}`
    );

  }

  const ai = await aiService.analyzeText(
    result.extractedText
  );

  return {

    ...result,

    summary: ai.summary,

    category: ai.category,

    tags: ai.tags,

    embedding: ai.embedding

  };

};

module.exports = {
  extractText,
};