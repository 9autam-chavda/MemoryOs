const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
  createSession,
  getSessions,
  getSession,
  renameSession,
  deleteSession,
} = require("../controllers/memorySession.controller");

const router = express.Router();

router.use(protect);

router.post("/", createSession);

router.get("/", getSessions);

router.get("/:id", getSession);

router.patch("/:id", renameSession);

router.delete("/:id", deleteSession);

module.exports = router;