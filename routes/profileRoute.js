const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../helper/imageHelper");
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
