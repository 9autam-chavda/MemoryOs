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

router.get(
  "/upload-status/:jobId",
  protect,
  memoryController.getUploadStatus
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
  "/:id/related",
  protect,
  memoryController.getRelatedMemories
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

// Toggle favorite
router.patch(
  "/:id/favorite",
  protect,
  memoryController.toggleFavorite
);

// Create share link
router.post(
  "/:id/share",
  protect,
  memoryController.createShare
);

// Disable share
router.delete(
  "/:id/share",
  protect,
  memoryController.disableShare
);

module.exports = router;
