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

const refreshUserSession = async (req, res, next) => {
  if (req.session.user && req.session.user.id) {
    try {
      const freshUser = await registerRepo.findById(req.session.user.id);
      if (freshUser) {
        req.session.user = {
          id: freshUser.id,
          name: freshUser.name,
          email: freshUser.email,
          image: freshUser.image,
          roleId: freshUser.roleId,
        };
      }
    } catch (error) {
      console.error("Session refresh error:", error);
    }
  }
  next();
};

function alreadyLoggedIn(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}

module.exports = {
  protect,
  refreshUserSession,
  alreadyLoggedIn,
};
