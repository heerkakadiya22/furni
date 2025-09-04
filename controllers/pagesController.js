const productRepository = require("../repositories/productRepository");
const { Product, Wishlist } = require("../models");
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

    let products = await productRepository.findAll();

    let categories = [];
    if (products.length > 0) {
      const uniq = Array.from(
        new Set(products.map((p) => p.category?.name).filter(Boolean))
      );
      categories = uniq.map((name) => ({ name }));
    }

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
    const productSKU = req.params.sku;
    const product = await Product.findOne({
      where: { sku: productSKU },
    });

    if (!product) {
      return res.status(404).render("404", { title: "Product not found" });
    }

    product.sub_img = product.sub_img
      ? product.sub_img.split(",").filter(Boolean)
      : [];

    // Related products
    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.ne]: product.id },
      },
      limit: 4,
    });

    let isInWishlist = false;
    if (req.session?.user) {
      const wishlistItem = await Wishlist.findOne({
        where: { userId: req.session.user.id, sku: product.sku },
      });
      isInWishlist = !!wishlistItem;
    }

    res.render("productDetails", {
      title: product.name,
      product,
      relatedProducts,
      csrfToken: req.csrfToken(),
      currentPage: "Product Details",
      session: req.session,
      isInWishlist,
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

exports.renderWishlist = async (req, res) => {
  try {
    if (!req.session?.user) return res.redirect("/auth");

    const userId = req.session.user.id;

    const wishlists = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["name", "newPrice", "oldPrice", "main_img", "sku"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.render("Wishlist", {
      title: "Wishlist",
      csrfToken: req.csrfToken(),
      currentPage: "Wishlist",
      session: req.session,
      products: wishlists,
    });
  } catch (error) {
    console.error("Error rendering Wishlist page:", error);
    res.status(500).send("Something went wrong.");
  }
};

// Toggle wishlist: add or remove
exports.toggleWishlist = async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Login required" });
  }

  const { sku } = req.body;
  const userId = req.session.user.id;

  if (!sku) return res.status(400).json({ message: "SKU required" });

  try {
    const existing = await Wishlist.findOne({ where: { userId, sku } });

    let action;
    if (existing) {
      await existing.destroy();
      action = "removed";
    } else {
      await Wishlist.create({ userId, sku });
      action = "added";
    }

    res.status(200).json({ action, message: `Product ${action} to wishlist` });
  } catch (err) {
    console.error("Wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE: remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Login required" });
  }

  const { sku } = req.params;
  const userId = req.session.user.id;

  if (!sku) return res.status(400).json({ message: "SKU required" });

  try {
    const existing = await Wishlist.findOne({ where: { userId, sku } });

    if (!existing) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    await existing.destroy();
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error("Wishlist remove error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
