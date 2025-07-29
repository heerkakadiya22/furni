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


module.exports = router;
