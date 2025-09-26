const authRepo = require("../repositories/authRepository");
const { validationResult } = require("express-validator");

async function renderChangePassword(
  res,
  req,
  { success = null, error = null } = {}
) {
  const userId = req.session.user.id;
  const user = await authRepo.findById(userId);
  return res.render("user-changePassword", {
    ...user.dataValues,
    title: "Change Password",
    csrfToken: req.csrfToken(),
    success,
    error,
    session: req.session,
    user: req.session.user,
    currentPage: "changePassword",
  });
}

exports.changePasswordForm = (req, res) => {
  renderChangePassword(res, req);
};

exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return renderChangePassword(res, req, {
      error: errors.array()[0].msg,
    });
  }
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
