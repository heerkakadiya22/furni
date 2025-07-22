const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { upload, protect } = require("../middleware/authMiddleware");
const { baseRules } = require("../validators/profileValidator");

router.get("/profile", protect, profileController.getProfile);

router.post(
  "/profile",
  protect,
  upload.single("image"),
  baseRules,
  profileController.updateProfile
);

module.exports = router;
