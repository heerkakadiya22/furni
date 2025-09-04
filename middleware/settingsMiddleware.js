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

const currencyFormatter = (req, res, next) => {
  res.locals.formatCurrency = (amount, locale = "en-IN", currency = "INR") => {
    if (typeof amount !== "number") amount = parseFloat(amount) || 0;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  next();
};

module.exports = currencyFormatter;
