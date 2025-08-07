const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/setting", protect, settingsController.renderSettings);
router.post("/setting/social/update", settingsController.updateSocialIcons);
router.delete("/setting/icon/:platform", settingsController.deleteSocialIcon);


module.exports = router;
