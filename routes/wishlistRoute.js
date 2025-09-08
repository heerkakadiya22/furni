const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.get("/wishlist", wishlistController.renderWishlist);
router.post("/wishlist", wishlistController.toggleWishlist);
router.delete("/wishlist/:sku", wishlistController.removeFromWishlist);

module.exports = router;
