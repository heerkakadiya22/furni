const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { registerValidation } = require("../validators/authValidator");
const { preventBackForLoggedIn } = require("../middleware/authMiddleware");

router.get("/auth", preventBackForLoggedIn, authController.renderAuth);
router.post("/register", registerValidation, authController.handleRegister);
router.post("/login", authController.handleLogin);
router.post("/logout", authController.logout);

module.exports = router;
