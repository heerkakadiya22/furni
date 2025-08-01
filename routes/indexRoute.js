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

router.get("/", indexController.renderIndex);

router.use(authRoute);
router.use(pagesRoute);
router.use(dashboardRoute);
router.use(passwordRoute);
router.use(roleRoute);
router.use(profileRoute);
router.use(userRoute);
router.use(verifyEmail);
router.use(categoryRoute);

module.exports = router;
