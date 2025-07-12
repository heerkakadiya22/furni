exports.renderBlog = (req, res) => {
  try {
    res.render("blog", {
      title: "Blog | Furni",
      csrfToken: req.csrfToken(),
      currentPage: "blog",
    });
  } catch (error) {
    console.error("Error rendering blog page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderShop = (req, res) => {
  try {
    res.render("shop", {
      title: "Shop | Furni",
      csrfToken: req.csrfToken(),
      currentPage: "shop",
    });
  } catch (error) {
    console.error("Error rendering shop page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderServices = (req, res) => {
  try {
    res.render("services", {
      title: "Services | Furni",
      csrfToken: req.csrfToken(),
      currentPage: "services",
    });
  } catch (error) {
    console.error("Error rendering services page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderContact = (req, res) => {
  try {
    res.render("contact", {
      title: "Contact | Furni",
      csrfToken: req.csrfToken(),
      currentPage: "contact",
    });
  } catch (error) {
    console.error("Error rendering contact page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderAbout = (req, res) => {
  try {
    res.render("about", {
      title: "About | Furni",
      csrfToken: req.csrfToken(),
      currentPage: "about",
    });
  } catch (error) {
    console.error("Error rendering about page:", error);
    res.status(500).send("Something went wrong.");
  }
};
