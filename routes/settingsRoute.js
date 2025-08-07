const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../helper/settingsHelper");

router.get("/setting", protect, settingsController.renderSettings);
router.post("/setting/social/update", settingsController.updateSocialIcons);
router.delete("/setting/icon/:platform", settingsController.deleteSocialIcon);

router.post(
  "/setting/general/update",
  protect,
  upload.fields([
    { name: "sitename_logo", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  settingsController.updateGeneralInfo
);
router.delete("/setting/general/:platform", settingsController.deleteGeneralField);


module.exports = router;
