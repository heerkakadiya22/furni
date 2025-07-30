
const registerRepo = require("../repositories/authRepository");

async function protect(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/");
  }

  try {
    const freshUser = await registerRepo.findById(req.session.user.id);
    if (freshUser?.roleId === 1) {
      req.session.user.roleId = 1;
      return next();
    }
  } catch (error) {
    console.error("Protect middleware error:", error);
  }
  return res.redirect("/");
}

module.exports = {
  protect,
};
