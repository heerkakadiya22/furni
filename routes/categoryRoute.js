const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { roleValidation } = require("../validators/rolesValidator");

// API endpoints
router.get("/categories", protect, categoryController.renderCategoryListPage);
router.get("/getCategory", protect, categoryController.getAllCategory);

module.exports = router;
