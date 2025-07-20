const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { upload, protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, profileController.getProfile);

router.post(
  "/profile",
  protect,
  upload.single("image"),
  profileController.updateProfile
);

module.exports = router;
