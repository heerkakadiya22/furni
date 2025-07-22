const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/passwordController");
const { protect } = require("../middleware/authMiddleware");

router.get("/password", passwordController.renderPasswordPage);
router.post("/forgot-password", passwordController.handleForgotPassword);
router.post("/reset-password", passwordController.handleResetPassword);

//change password route
router.get("/change-password", protect, passwordController.changePasswordForm);
router.post(
  "/change-password",
  protect,
  passwordController.changePassword
);

module.exports = router;
