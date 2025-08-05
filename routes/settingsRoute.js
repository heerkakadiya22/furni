const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/settings", protect, settingsController.renderSettings);

module.exports = router;
