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

//change password

async function renderChangePassword(
  res,
  req,
  { success = null, error = null } = {}
) {
  const userId = req.session.user.id;
  const user = await authRepo.findById(userId);
  return res.render("changePassword", {
    ...user.dataValues,
    title: "Change Password",
    csrfToken: req.csrfToken(),
    success,
    error,
    user: req.session.user,
    currentPage: "changePassword",
    breadcrumbs: [
      { label: "Home", url: "/dashboard" },
      { label: "Change Password" },
    ],
  });
}

exports.changePasswordForm = (req, res) => {
  renderChangePassword(res, req);
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.session.user?.id;

    if (!userId) return res.status(401).send("Unauthorized");

    const user = await authRepo.findById(userId);
    if (!user) return res.status(404).send("User not found");

    if (user.password !== currentPassword) {
      return renderChangePassword(res, req, {
        error: "Current password is incorrect",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return renderChangePassword(res, req, {
        error: "New and confirm password do not match",
      });
    }

    await authRepo.update(userId, { password: newPassword });

    return renderChangePassword(res, req, {
      success: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return renderChangePassword(res, req, { error: "Internal Server Error" });
  }
};
