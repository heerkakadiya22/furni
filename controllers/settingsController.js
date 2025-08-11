const authRepo = require("../repositories/authRepository");
const settingRepo = require("../repositories/settingsRepository");

exports.renderSettings = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepo.findById(userId);

    const tab = req.query.tab || "connections";

    const tabTitles = {
      connections: "Connections",
      theme: "Theme",
      terms_privacy: "Terms & Privacy",
    };

    const settings = await settingRepo.getSettings();

    res.render("setting", {
      title: tabTitles[tab],
      csrfToken: req.csrfToken(),
      user: req.session.user,
      currentPage: "Settings",
      activeTab: tab,
      ...user.dataValues,
      settings,
      breadcrumbs: [
        { label: "Home", url: "/dashboard" },
        { label: "Settings" },
        { label: tabTitles[tab] || "Connections" },
      ],
    });
  } catch (error) {
    console.error("Error rendering settings:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.updateSocialIcons = async (req, res) => {
  try {
    const { facebook_icon, twitter_icon, insta_icon, linkedin_icon } = req.body;

    await settingRepo.updateSettings({
      facebook_icon,
      twitter_icon,
      insta_icon,
      linkedin_icon,
    });

    res.redirect("/setting?tab=connections");
  } catch (err) {
    console.error("Error updating social icons:", err);
    res.status(500).send("Failed to update social icons.");
  }
};

exports.deleteSocialIcon = async (req, res) => {
  try {
    const { platform } = req.params;
    console.log("➡️ Platform to delete:", platform);

    await settingRepo.clearIconByPlatform(platform);

    res.json({ success: true, message: `${platform} icon deleted.` });
  } catch (err) {
    console.error("❌ Delete Error:", err.stack || err.message);
    res.status(500).json({ error: err.message || "Failed to delete icon." });
  }
};

exports.updateGeneralInfo = async (req, res) => {
  try {
    const { email, phone, location } = req.body;
    const updateData = { email, phone, location };

    if (req.files?.sitename_logo?.[0]) {
      updateData.sitename_logo = req.files.sitename_logo[0].filename;
    }

    if (req.files?.logo?.[0]) {
      updateData.logo = req.files.logo[0].filename;
    }

    await settingRepo.updateSettings(updateData);
    res.redirect("/setting?tab=connections");
  } catch (err) {
    console.error("Error updating general info:", err);
    res.status(500).send("Failed to update general info.");
  }
};

exports.deleteGeneralField = async (req, res) => {
  try {
    const { platform } = req.params;
    await settingRepo.clearGeneralField(platform);

    res.json({ success: true, message: `${platform} deleted.` });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: err.message || "Failed to delete field." });
  }
};

// ===== TERMS & PRIVACY =====
exports.updateTermsPrivacy = async (req, res) => {
  try {
    const { terms, privacy, description } = req.body;

    await settingRepo.updateSettings({
      terms,
      privacy,
      description,
    });

    res.redirect("/setting?tab=terms_privacy");
  } catch (err) {
    console.error("Error updating terms & privacy:", err);
    res.status(500).send("Failed to update terms & privacy.");
  }
};

exports.deleteTermsPrivacyField = async (req, res) => {
  try {
    const { field } = req.params;
    await settingRepo.clearTermsPrivacyField(field);

    res.json({ success: true, message: `${field} content deleted.` });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: err.message || "Failed to delete content." });
  }
};


exports.updateThemeColor = async (req, res) => {
  try {
    const { theme_color } = req.body;

    await settingRepo.updateSettings({ theme_color });

    res.redirect("/setting?tab=theme");
  } catch (err) {
    console.error("Error updating theme color:", err);
    res.status(500).send("Failed to update theme color.");
  }
};
