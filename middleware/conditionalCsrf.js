const csrf = require("csurf");
const csrfProtection = csrf();

const exemptPaths = ["/profile", "/adduser"];

const exemptEditPathRegex = /^\/users\/\d+\/edit$/;

module.exports = function (req, res, next) {
  const isPost = req.method === "POST";
  const isExemptPath = exemptPaths.includes(req.path);
  const isEditPath = exemptEditPathRegex.test(req.path);

  if (isPost && (isExemptPath || isEditPath)) {
    return next();
  }

  csrfProtection(req, res, next);
};
