const authRepo = require("../repositories/authRepository");

exports.renderSettings = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepo.findById(userId);

    const tab = req.query.tab || "Connections";

    const tabTitles = {
      connections: "Connections",
      theme: "Theme",
      notifications: "Notifications",
    };

    res.render("setting", {
      title: tabTitles[tab],
      ...user.dataValues,
      csrfToken: req.csrfToken(),
      user: req.session.user,
      currentPage: "Settings",
      activeTab: tab,
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
