const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pagesController");

router.get("/blog", pageController.renderBlog);
router.get("/shop", pageController.renderShop);
router.get("/services", pageController.renderServices);
router.get("/contact", pageController.renderContact);
router.get("/about", pageController.renderAbout);
router.get("/cart", pageController.renderCart);
router.get("/checkout", pageController.renderCheckout);
router.get("/thanks", pageController.renderThanks);
router.get("/product/:sku", pageController.renderProductDetails);
router.get("/terms-and-privacy", pageController.renderTermsAndPrivacy);
router.get("/wishlist", pageController.renderWishlist);
router.post("/wishlist", pageController.toggleWishlist);
router.delete("/wishlist/:sku", pageController.removeFromWishlist);

module.exports = router;
