const authRepo = require("../repositories/authRepository");

exports.renderCheckout = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepo.findById(userId);

    res.render("checkout", {
      title: "checkout",
      ...user.dataValues,
      user: req.session.user,
      csrfToken: req.csrfToken(),
      currentPage: "checkout",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering about page:", error);
    res.status(500).send("Something went wrong.");
  }
};
