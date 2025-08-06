const authRepo = require("../repositories/authRepository");
const settingRepo = require("../repositories/settingsRepository");
const { Op } = require("sequelize");
const { Setting } = require("../models");

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

    // Tab-specific data
    let tabData = {};

    if (tab === "connections") {
      tabData.socials = await settingRepo.findSocialIcons();
    }

    if (tab === "theme") {
      tabData.themeSettings = await settingRepo.findTheme();
    }

    // Render page
    res.render("setting", {
      title: tabTitles[tab],
      csrfToken: req.csrfToken(),
      user: req.session.user,
      currentPage: "Settings",
      activeTab: tab,
      ...user.dataValues,
      ...tabData,
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

exports.saveSocialIcon = async (req, res) => {
  const { platform, iconClass, link } = req.body;

  if (!["facebook", "twitter", "insta", "linkedin"].includes(platform)) {
    return res.status(400).send("Invalid platform");
  }

  try {
    await settingRepo.insertSocialIcon(platform, iconClass, link);
    res.redirect("/settings?tab=connections");
  } catch (err) {
    console.error("Error saving social icon:", err);
    res.status(500).send("Something went wrong.");
  }
};

exports.deleteSocialIcon = async (req, res) => {
  try {
    const platform = req.params.platform.toLowerCase();

    const iconColumn = `${platform}_icon`;
    const validColumns = [
      "facebook_icon",
      "twitter_icon",
      "insta_icon",
      "linkedin_icon",
    ];

    if (!validColumns.includes(iconColumn)) {
      return res.status(400).json({ error: "Invalid platform" });
    }

    const whereCondition = {};
    whereCondition[iconColumn] = { [Op.ne]: null };

    const deletedCount = await Setting.destroy({ where: whereCondition });

    if (deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: `${platform} icon deleted successfully.`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No ${platform} icon found to delete.`,
      });
    }
  } catch (err) {
    console.error("Error deleting social icon:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
