const express = require("express");
const router = express.Router();
const vEmailController = require("../controllers/verifyEmailController");

router.get("/verify-email", vEmailController.verifyEmail);

module.exports = router;
