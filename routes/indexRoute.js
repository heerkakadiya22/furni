const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const { preventBackForLoggedIn } = require("../middleware/authMiddleware");

router.get("/", preventBackForLoggedIn, indexController.renderIndex);

module.exports = router;
