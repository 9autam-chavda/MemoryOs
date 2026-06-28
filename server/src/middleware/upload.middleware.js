const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/",
    "application/pdf",
    "audio/",
    "video/",
    "text/plain",
    "text/markdown",
  ];

  const isAllowed = allowedTypes.some(type => {
    if (type.endsWith("/")) {
      return file.mimetype.startsWith(type);
    }

    return file.mimetype === type;
  });

  if (!isAllowed) {
    return cb(new Error("Unsupported file type"), false);
  }

  cb(null, true);

};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

module.exports = upload;