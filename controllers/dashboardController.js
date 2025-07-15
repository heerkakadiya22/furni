exports.renderDashboard = (req, res) => {
  try {
    res.render("dashboard/dashboard", {
      title: "Dashboard | Furni",
      csrfToken: req.csrfToken(),
      user: req.session.user,
      currentPage: "dashboard",
    });
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    res.status(500).send("Something went wrong.");
  }
};
