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

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/auth"),
  path.join(__dirname, "views/pages"),
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
app.use(csrf());

// Routes
app.use(indexRoute);
app.use(authRoute);
app.use(pagesRoute);

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
