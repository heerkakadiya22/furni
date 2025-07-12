const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pagesController");

router.get("/blog", pageController.renderBlog);
router.get("/shop", pageController.renderShop);
router.get("/services", pageController.renderServices);
router.get("/contact", pageController.renderContact);
router.get("/about", pageController.renderAbout);

module.exports = router;
