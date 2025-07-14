exports.protect = (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    return res.redirect("/");
  }
  next();
};

exports.preventBackForLoggedIn = (req, res, next) => {
  const { user } = req.session;

  if (user) {
    return res.redirect("/dashboard");
  }
  next();
};
