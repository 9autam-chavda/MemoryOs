const express = require("express");

const protect = require(
  "../middleware/auth.middleware"
);

const router =
  express.Router();

router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json({
      success: true,
      message:
        "Protected Route Accessed",
      user: req.user,
    });
  }
);

module.exports = router;