const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");

router.get("/auth", authController.renderAuth);
router.post("/register", registerValidation, authController.handleRegister);
router.post("/login", loginValidation, authController.handleLogin);
router.post("/logout", authController.logout);

module.exports = router;
