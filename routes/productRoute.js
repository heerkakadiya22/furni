const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

router.get("/products", protect, productsController.renderProductListPage);
router.get("/getproducts", protect, productsController.getAllProducts);
router.delete("/products/:id", protect, productsController.deleteProduct);

module.exports = router;
