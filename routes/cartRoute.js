const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/cart", cartController.addOrUpdateCart);
router.get("/cart", cartController.renderCart);
router.delete("/cart/remove/:id", cartController.removeFromCart);

module.exports = router;
