exports.renderCheckout = (req, res) => {
  try {
    res.render("checkout", {
      title: "checkout",
      csrfToken: req.csrfToken(),
      currentPage: "checkout",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering about page:", error);
    res.status(500).send("Something went wrong.");
  }
};
