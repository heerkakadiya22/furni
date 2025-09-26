const express = require("express");
const router = express.Router();
const profileController = require("../controllers/userProfileController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../helper/imageHelper");
const { baseRules } = require("../validators/profileValidator");

router.get("/user-profile", protect, profileController.getUserProfile);
router.post(
  "/user-profile",
  protect,
  upload.single("image"),
  baseRules,
  profileController.updateProfile
);

module.exports = router;
