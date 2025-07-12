const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { registerValidation } = require("../validators/authValidator");

router.get("/auth", authController.renderAuth);
router.post("/register", registerValidation, authController.handleRegister);
router.post("/login", authController.handleLogin);

module.exports = router;
