const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");

router.get("/checkout", checkoutController.renderCheckout);
router.post("/checkout", checkoutController.saveAddress);
router.delete("/checkout/:id", checkoutController.deleteAddress);

module.exports = router;
