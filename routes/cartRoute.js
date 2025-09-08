const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/cart/add", cartController.addToCart);
router.get("/cart", cartController.renderCart);
router.get("/cart/remove/:id", cartController.removeFromCart);

module.exports = router;
