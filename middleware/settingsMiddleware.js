const settingRepo = require("../repositories/settingsRepository");

const settingsMiddleware = async (req, res, next) => {
  try {
    const latestSettings = await settingRepo.getSettings();
    req.session.settings = latestSettings;
    res.locals.settings = latestSettings;

    next();
  } catch (err) {
    console.error("Settings middleware error:", err);
    res.locals.settings = {};
    next();
  }
};

module.exports = settingsMiddleware;
