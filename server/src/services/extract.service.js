const imageExtractor = require("./extractors/image.extractor");
const pdfExtractor = require("./extractors/pdf.extractor");
const audioExtractor = require("./extractors/audio.extractor");
const videoExtractor = require("./extractors/video.extractor");
const textExtractor = require("./extractors/text.extractor");

const extractText = async (file) => {

  const mimeType = file.mimetype;

  if (mimeType.startsWith("image/")) {
    return await imageExtractor.extract(file);
  }

  if (mimeType === "application/pdf") {
    return await pdfExtractor.extract(file);
  }

  if (mimeType.startsWith("audio/")) {
    return await audioExtractor.extract(file);
  }

  if (mimeType.startsWith("video/")) {
    return await videoExtractor.extract(file);
  }

  if (
    mimeType === "text/plain" ||
    mimeType === "text/markdown"
  ) {
    return await textExtractor.extract(file);
  }

  throw new Error(`Unsupported file type: ${mimeType}`);

};

module.exports = {
  extractText,
};