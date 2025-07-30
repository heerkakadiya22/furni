const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { categoryValidation } = require("../validators/categoryValidator");

// API endpoints
router.get("/categories", protect, categoryController.renderCategoryListPage);
router.get("/getCategory", protect, categoryController.getAllCategory);
router.get("/addcategory", protect, categoryController.renderCategoryForm);
router.get(
  "/categories/:id/edit",
  protect,
  categoryController.renderCategoryForm
);

router.post(
  "/addcategory",
  protect,
  categoryValidation,
  categoryController.createCategory
);

router.post(
  "/categories/:id/edit",
  protect,
  categoryValidation,
  categoryController.updateCategory
);

router.delete("/categories/:id", protect, categoryController.deleteCategory);

module.exports = router;
