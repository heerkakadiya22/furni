const express = require("express");
const app = express();
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");
require("dotenv").config();
const CONFIG = require("./config/config");
const ENV = process.env.NODE_ENV || "development";
require("./config/db");

const indexRoute = require("./routes/indexRoute");

const conditionCsrf = require("./middleware/conditionalCsrf");
const { refreshUserSession } = require("./middleware/authMiddleware");
const {
  settingsMiddleware,
  currencyFormatter,
} = require("./middleware/settingsMiddleware");

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/public"),
  path.join(__dirname, "views/public/auth"),
  path.join(__dirname, "views/public/pages"),
  path.join(__dirname, "views/public/account"),
  path.join(__dirname, "views/dashboard"),
  path.join(__dirname, "views/dashboard/roles"),
  path.join(__dirname, "views/dashboard/account"),
  path.join(__dirname, "views/dashboard/manageuser"),
  path.join(__dirname, "views/dashboard/categories"),
  path.join(__dirname, "views/dashboard/settings"),
  path.join(__dirname, "views/dashboard/products"),
]);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(
  session({
    secret: CONFIG[ENV].secretKey,
    store: new FileStore({ path: "./sessions" }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(conditionCsrf);
app.use(refreshUserSession);
app.use(settingsMiddleware);
app.use(currencyFormatter);

app.use(indexRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
