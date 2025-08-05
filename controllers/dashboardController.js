const authRepo = require("../repositories/authRepository");

exports.renderDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepo.findById(userId);

    res.render("dashboard", {
      title: "Dashboard | Furni",
      ...user.dataValues,
      csrfToken: req.csrfToken(),
      user: req.session.user,
      currentPage: "dashboard",
      title: "Admin dashboard",
    });
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    res.status(500).send("Something went wrong.");
  }
};
