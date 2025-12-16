const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.get("/invoice/:id", invoiceController.renderInvoice);
router.get("/orders", invoiceController.orderList);

module.exports = router;
