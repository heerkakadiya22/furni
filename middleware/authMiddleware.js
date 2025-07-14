exports.preventBackForLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  next();
};

exports.protect = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
};
