const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// Dashboard route
router.get("/dashboard", protect, dashboardController.renderDashboard);

module.exports = router;
