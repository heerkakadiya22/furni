exports.renderBlog = (req, res) => {
  try {
    res.render("blog", {
      title: "Blog",
      csrfToken: req.csrfToken(),
      currentPage: "blog",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering blog page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderServices = (req, res) => {
  try {
    res.render("services", {
      title: "Services",
      csrfToken: req.csrfToken(),
      currentPage: "services",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering services page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderContact = (req, res) => {
  try {
    res.render("contact", {
      title: "Contact us",
      csrfToken: req.csrfToken(),
      currentPage: "contact",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering contact page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderAbout = (req, res) => {
  try {
    res.render("about", {
      title: "About Us",
      csrfToken: req.csrfToken(),
      currentPage: "about",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering about page:", error);
    res.status(500).send("Something went wrong.");
  }
};

const { Invoice } = require("../models");

exports.renderThanks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const invoiceId = req.query.invoice;
    const userId = req.session.user.id;

    if (!invoiceId) {
      return res.status(400).send("Invalid invoice id");
    }

    const invoice = await Invoice.findOne({
      where: {
        id: invoiceId,
        user_id: userId,
        status: 1,
      },
    });

    if (!invoice) {
      return res.status(404).send("Invoice not found or unauthorized");
    }

    res.render("thanks", {
      title: "Thank You",
      invoice,
      session: req.session,
      currentPage: "Thank You",
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.error("THANKS PAGE ERROR ", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderPaymentFailed = (req, res) => {
  try {
    res.render("payment-failed", {
      title: "payment Failed",
      csrfToken: req.csrfToken(),
      currentPage: "payment Failed",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering payment failed page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderTermsAndPrivacy = async (req, res) => {
  try {
    const type = req.query.type || "terms";
    const pageTitle =
      type === "terms" ? "Terms & Conditions" : "Privacy Policy";

    res.render("termsAndPrivacy", {
      type,
      title: pageTitle,
      csrfToken: req.csrfToken(),
      currentPage: pageTitle,
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering Terms & Privacy page:", error);
    res.status(500).send("Something went wrong.");
  }
};
