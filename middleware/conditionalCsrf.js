const csrf = require("csurf");
const csrfProtection = csrf();

const exemptPaths = [
  "/profile",
  "/adduser",
  "/setting/general/update",
  "/addproduct",
  "/user-profile",
];

const exemptRegexPaths = [/^\/users\/\d+\/edit$/, /^\/products\/\d+\/edit$/];

module.exports = function (req, res, next) {
  const isPost = req.method === "POST";
  const isExemptPath = exemptPaths.includes(req.path);
  const isEditPath = exemptRegexPaths.some((regex) => regex.test(req.path));

  if (isPost && (isExemptPath || isEditPath)) {
    return next();
  }

  csrfProtection(req, res, next);
};
