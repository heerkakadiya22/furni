const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/userPasswordController");
const { protect } = require("../middleware/authMiddleware");
const { cpValidation } = require("../validators/passwordValidator");

router.get(
  "/user-changePassword",
  protect,
  passwordController.changePasswordForm
);

router.post(
  "/user-changePassword",
  protect,
  cpValidation,
  passwordController.changePassword
);

module.exports = router;
