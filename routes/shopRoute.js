const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");


router.get("/shop", shopController.renderShop);
router.get("/product/:sku", shopController.renderProductDetails);

module.exports = router;