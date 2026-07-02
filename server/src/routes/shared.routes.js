const express = require("express");
const router = express.Router();

const memoryService = require("../services/memory.service");

// Public: get shared memory by token
router.get("/:token", async (req, res) => {
  try {
    const data = await memoryService.getSharedByToken(req.params.token);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 404).json({ success: false, message: error.message });
  }
});

module.exports = router;
