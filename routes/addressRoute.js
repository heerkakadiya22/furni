const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.get("/user-address", addressController.renderAddressPage);
router.post("/user-address", addressController.saveAddress);

module.exports = router;
