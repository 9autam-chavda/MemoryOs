const ocrService = require("../services/ocr.service");

const testOCR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const result = await ocrService.extractText(req.file.buffer);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  testOCR,
};