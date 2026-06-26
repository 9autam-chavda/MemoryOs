const express = require("express");
const multer = require("multer");

const { testOCR } = require("../controllers/test.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/ocr",
  upload.single("file"),
  testOCR
);

module.exports = router;