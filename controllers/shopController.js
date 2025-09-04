const productRepository = require("../repositories/productRepository");
const { Product, Wishlist } = require("../models");
const { Op } = require("sequelize");

exports.renderShop = async (req, res) => {
  try {
    const { category, search } = req.query;

    let products = await productRepository.findAll({ isActive: true });

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
