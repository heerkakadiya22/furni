const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/cart", cartController.renderCart);
router.post("/cart/add", cartController.addToCart);
router.post("/cart/update", cartController.updateCartQuantity);
router.delete("/cart/remove/:id", cartController.removeFromCart);

module.exports = router;
