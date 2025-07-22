const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/passwordController");
const { protect } = require("../middleware/authMiddleware");
const {
  fpValidation,
  rpValidation,
  cpValidation,
} = require("../validators/passwordValidator");

router.get("/password", passwordController.renderPasswordPage);
router.post(
  "/forgot-password",
  fpValidation,
  passwordController.handleForgotPassword
);
router.post(
  "/reset-password",
  rpValidation,
  passwordController.handleResetPassword
);

//change password route
router.get("/change-password", protect, passwordController.changePasswordForm);
router.post(
  "/change-password",
  protect,
  cpValidation,
  passwordController.changePassword
);

module.exports = router;
