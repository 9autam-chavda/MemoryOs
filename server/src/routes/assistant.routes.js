const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
  askAssistant,
} = require("../controllers/assistant.controller");

const router = express.Router();

router.post("/ask", protect, askAssistant);

module.exports = router;