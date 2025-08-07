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
      notifications: "Notifications",
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
