const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../helper/productHelper");

router.get("/products", protect, productsController.renderProductListPage);
router.get("/getproducts", protect, productsController.getAllProducts);
router.delete("/products/:id", protect, productsController.deleteProduct);
router.get("/addproduct", protect, productsController.renderProductForm);
router.get("/products/:id/edit", protect, productsController.renderProductForm);
router.post("/addproduct", upload.any(), productsController.handleProductSave);

router.post(
  "/products/:id/edit",
  upload.any(),
  productsController.handleProductSave
);

module.exports = router;
