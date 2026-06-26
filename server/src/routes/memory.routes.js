const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const memoryController = require("../controllers/memory.controller");

// Upload Memory
router.post(
  "/upload",
  protect,
  upload.single("file"),
  memoryController.uploadMemory
);

// Get All Memories
router.get(
  "/",
  protect,
  memoryController.getMemories
);

// Search Memories
router.get(
  "/search",
  protect,
  memoryController.searchMemories
);

router.get(
  "/:id",
  protect,
  memoryController.getMemoryDetails
);

// Delete Memory
router.delete(
  "/:id",
  protect,
  memoryController.deleteMemory
);

module.exports = router;