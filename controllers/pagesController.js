const productRepository = require("../repositories/productRepository");
const { Product } = require("../models");
const { Op } = require("sequelize");

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

exports.renderShop = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Get all products with category (already handled in repo)
    let products = await productRepository.findAll();

    // Build categories list from products
    let categories = [];
    if (products.length > 0) {
      const uniq = Array.from(
        new Set(products.map((p) => p.category?.name).filter(Boolean))
      );
      categories = uniq.map((name) => ({ name }));
    }

    // Apply filters
    if (category && category !== "all") {
      products = products.filter(
        (p) => p.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      products = products.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.render("shop", {
      title: "Shop",
      csrfToken: req.csrfToken(),
      currentPage: "shop",
      session: req.session,
      products,
      categories,
      selectedCategory: category || "all",
      searchQuery: search || "",
    });
  } catch (error) {
    console.error("Error rendering shop page:", error);
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

exports.renderCart = (req, res) => {
  try {
    res.render("cart", {
      title: "Cart",
      csrfToken: req.csrfToken(),
      currentPage: "Cart",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering about page:", error);
    res.status(500).send("Something went wrong.");
  }
};

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

exports.renderThanks = (req, res) => {
  try {
    res.render("thanks", {
      title: "Thank You",
      csrfToken: req.csrfToken(),
      currentPage: "Thank You",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering about page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).render("404", { title: "Product not found" });
    }

    product.sub_img = product.sub_img
      ? product.sub_img.split(",").filter(Boolean)
      : [];

    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.ne]: product.id },
      },
      limit: 4,
    });

    res.render("productDetails", {
      title: product.name,
      product,
      relatedProducts,
      csrfToken: req.csrfToken(),
      currentPage: "Product Details",
      session: req.session,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Something went wrong");
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
      currentPage: type === "terms" ? "Terms & Conditions" : "Privacy Policy",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering Terms & Privacy page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.renderWishlist = (req, res) => {
  try {
    res.render("Wishlist", {
      title: "Wishlist",
      csrfToken: req.csrfToken(),
      currentPage: "Wishllist",
      session: req.session,
    });
  } catch (error) {
    console.error("Error rendering Wishlist page:", error);
    res.status(500).send("Something went wrong.");
  }
};
