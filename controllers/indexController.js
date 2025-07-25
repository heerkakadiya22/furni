exports.renderIndex = (req, res) => {
  try {
    res.render("index", {
      title: "Home | Furni",
      csrfToken: req.csrfToken(),
      session: req.session,
      currentPage: "index",
      error: req.session.error || null,
      success: req.session.success || null,
      formData: req.session.formData || {},
    });

    req.session.error = null;
    req.session.success = null;
    req.session.formData = null;
  } catch (error) {
    console.error("Error rendering home page:", error);
    res.status(500).send("Something went wrong.");
  }
};
