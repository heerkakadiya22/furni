const express = require("express");
const app = express();
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");
const csrf = require("csurf");
require("dotenv").config();
const CONFIG = require("./config/config");
const ENV = process.env.NODE_ENV || "development";
require("./config/db");

// Routes
const indexRoute = require("./routes/indexRoute");
const authRoute = require("./routes/authRoute");
const pagesRoute = require("./routes/pagesRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const passwordRoute = require("./routes/passwordRoute");
const roleRoute = require("./routes/roleRoute");
const profileRoute = require("./routes/profileRoute");

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/public"),
  path.join(__dirname, "views/public/auth"),
  path.join(__dirname, "views/public/pages"),
  path.join(__dirname, "views/dashboard"),
  path.join(__dirname, "views/dashboard/roles"),
  path.join(__dirname, "views/dashboard/account"),
]);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files FIRST
app.use("/assets", express.static(path.join(__dirname, "assets")));

// ✅ Setup session
app.use(
  session({
    secret: CONFIG[ENV].secretKey,
    store: new FileStore({ path: "./sessions" }),
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Then apply CSRF
const csrfProtection = csrf();
app.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/profile") {
    return next();
  }
  csrfProtection(req, res, next);
});

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Routes
app.use(indexRoute);
app.use(authRoute);
app.use(pagesRoute);
app.use(dashboardRoute);
app.use(passwordRoute);
app.use(roleRoute);
app.use(profileRoute);

// // ✅ Optional error handler for CSRF
// app.use((err, req, res, next) => {
//   if (err.code === "EBADCSRFTOKEN") {
//     return res.status(403).send("Invalid CSRF token.");
//   }
//   next(err);
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
