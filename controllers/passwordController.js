const authRepo = require("../repositories/authRepository");

// Show forgot/reset password form
exports.renderPasswordPage = function (req, res) {
  const error = req.session.error || null;
  const success = req.session.success || null;
  const email = req.session.email || "";
  const action = req.query.action || "forgot";

  if (action === "forgot") {
    req.session.error = null;
    req.session.success = null;
    req.session.email = null;
  }

  res.render("forgot-reset", {
    csrfToken: req.csrfToken(),
    error,
    success,
    action,
    email,
    currentPage: "auth",
  });
};

// Handle forgot password form
exports.handleForgotPassword = function (req, res) {
  const email = req.body.email;

  authRepo
    .findByEmail(email)
    .then((user) => {
      if (!user) {
        req.session.error = "Email does not exist.";
        return req.session.save(() => {
          return res.redirect("/password");
        });
      }

      req.session.email = email;
      return req.session.save(() => {
        return res.redirect("/password?action=reset");
      });
    })
    .catch((err) => {
      console.error(err);
      req.session.error = "Something went wrong.";
      return req.session.save(() => {
        return res.redirect("/password");
      });
    });
};

// Handle password reset
exports.handleResetPassword = function (req, res) {
  const password = req.body.newPassword;
  const confirm = req.body.confirmNewPassword;
  const email = req.session.email;

  if (!email) {
    req.session.error = "Session expired. Please try again.";
    return req.session.save(() => {
      return res.redirect("/password");
    });
  }

  if (password !== confirm) {
    req.session.error = "Passwords do not match.";
    return req.session.save(() => {
      return res.redirect("/password?action=reset");
    });
  }

  authRepo
    .updatePasswordByEmail(email, password)
    .then(() => {
      req.session.success = "Password updated successfully!";
      req.session.email = null;
      return req.session.save(() => {
        return res.redirect("/auth?show=login");
      });
    })
    .catch((err) => {
      console.error(err);
      req.session.error = "Failed to update password.";
      return req.session.save(() => {
        return res.redirect("/password?action=reset");
      });
    });
};
