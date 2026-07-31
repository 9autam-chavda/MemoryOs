const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Multer file size error
  if (
    err instanceof multer.MulterError &&
    err.code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(400).json({
      success: false,
      message: "Maximum upload size is 100 MB.",
    });
  }

  // Unsupported file type
  if (err.message === "Unsupported file type") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Default
  return res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;