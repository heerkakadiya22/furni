const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.get("/invoice/:id", invoiceController.renderInvoice);

module.exports = router;
