const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/passwordController");

router.get("/password", passwordController.renderPasswordPage);
router.post("/forgot-password", passwordController.handleForgotPassword);
router.post("/reset-password", passwordController.handleResetPassword);

module.exports = router;
