const express =
  require("express");

const router =
  express.Router();

const protect =
  require(
    "../middleware/auth.middleware"
  );

const upload =
  require(
    "../middleware/upload.middleware"
  );

const memoryController =
  require(
    "../controllers/memory.controller"
  );

router.post(
  "/upload",
  protect,
  upload.single("file"),
  memoryController.uploadMemory
);

router.get(
    "/",
    protect,
    memoryController.getMemories
);

module.exports = router;