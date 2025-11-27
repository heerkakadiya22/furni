const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

const authRoute = require("./authRoute");
const pagesRoute = require("./pagesRoute");
const dashboardRoute = require("./dashboardRoute");
const passwordRoute = require("./passwordRoute");
const roleRoute = require("./roleRoute");
const profileRoute = require("./profileRoute");
const userRoute = require("./usersRoute");
const verifyEmail = require("./verifyEmailRoute");
const categoryRoute = require("./categoryRoute");
const settingsRoute = require("./settingsRoute");
const productRoute = require("./productRoute");
const wishlistRoute = require("./wishlistRoute");
const shopRoute = require("./shopRoute");
const cartRoute = require("./cartRoute");
const checkoutRoute = require("./checkoutRoute");
const userProfileRoute = require("./userProfileRoute");
const userPasswordRoute = require("./userPasswordRoute");
const addressRoute = require("./addressRoute");
const paymentRoute = require("./paymentRoute");

router.get("/", indexController.renderIndex);

router.use(authRoute);
router.use(pagesRoute);
router.use(shopRoute);
router.use(dashboardRoute);
router.use(passwordRoute);
router.use(roleRoute);
router.use(profileRoute);
router.use(userRoute);
router.use(verifyEmail);
router.use(categoryRoute);
router.use(settingsRoute);
router.use(productRoute);
router.use(wishlistRoute);
router.use(cartRoute);
router.use(checkoutRoute);
router.use(userProfileRoute);
router.use(userPasswordRoute);
router.use(addressRoute);
router.use(paymentRoute);

module.exports = router;
