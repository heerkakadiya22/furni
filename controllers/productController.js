const productRepository = require("../repositories/productRepository");
const authRepository = require("../repositories/authRepository");
const { validationResult } = require("express-validator");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productRepository.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};

exports.renderProductListPage = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepository.findById(userId);

    const products = await productRepository.findAll();

    console.log("Rendering view: productslist");
    console.log("Products count:", products.length);

    res.render("productslist", {
      ...user.dataValues,
      breadcrumbs: [
        { label: "Home", url: "/dashboard" },
        { label: "Products" },
      ],
      currentPage: "products",
      csrfToken: req.csrfToken(),
      user: req.session.user,
      title: "Products List",
      products,
    });
  } catch (error) {
    console.error("Error rendering products list page:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productRepository.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("❌ Product delete error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};
