const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/settings", protect, settingsController.renderSettings);

router.post("/settings/social", protect, settingsController.saveSocialIcon);

router.delete(
  "/settings/social/:platform",
  protect,
  settingsController.deleteSocialIcon
);

module.exports = router;
