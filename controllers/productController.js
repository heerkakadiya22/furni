const productRepository = require("../repositories/productRepository");
const authRepository = require("../repositories/authRepository");
const categoryRepo = require("../repositories/categoryRepository");
const { validationResult } = require("express-validator");
const {
  deleteOldImage,
  getMainImage,
  getSubImages,
} = require("../helper/productHelper");

// Fetch All Products (API)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productRepository.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};

// Render Product List Page
exports.renderProductListPage = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepository.findById(userId);
    const products = await productRepository.findAll();

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

// Render Add/Edit Form
exports.renderProductForm = async (req, res) => {
  try {
    const productId = req.params.id;
    let product = null;

    const userId = req.session.user.id;
    const user = await authRepository.findById(userId);

    const categories = await categoryRepo.findAll();

    if (productId) {
      product = await productRepository.findById(productId);
      if (!product) {
        req.session.error = "Product not found.";
        return res.redirect("/products");
      }
    }

    res.render("productform", {
      ...user.dataValues,
      title: product ? "Edit Product" : "Add Product",
      currentPage: "products",
      product,
      categories,
      breadcrumbs: [
        { label: "Home", url: "/dashboard" },
        { label: "Products", url: "/products" },
        { label: product ? "Edit Product" : "Add Product" },
      ],
      error: req.session.error || null,
      csrfToken: req.csrfToken(),
      user: req.session.user,
    });

    req.session.error = null;
  } catch (error) {
    console.error("Error rendering product form:", error);
    res.status(500).send("Something went wrong.");
  }
};

// Save Product (Add / Edit)
exports.handleProductSave = async (req, res) => {
  const isEdit = !!req.params.id;
  const productId = req.params.id;
  const formData = req.body;

  try {
    let existingProduct = null;

    if (isEdit) {
      existingProduct = await productRepository.findById(productId);
      if (!existingProduct) {
        return res.status(404).send("Product not found.");
      }

      if (req.files?.main_img && existingProduct.main_img) {
        deleteOldImage(existingProduct.main_img);
      }
    }

    const mainImage = getMainImage(req, existingProduct?.main_img);
    const subImages = getSubImages(req, existingProduct?.sub_img);

    const productData = {
      category_id: formData.category_id,
      name: formData.name,
      material: formData.material || null,
      description: formData.description || null,
      main_img: mainImage,
      sub_img: subImages,
      oldPrice: formData.oldPrice || null,
      newPrice: formData.newPrice,
      color: formData.color || null,
      tags: formData.tags || null,
      dimention: formData.dimention || null,
      isActive: formData.isActive ? true : false,
    };

    if (isEdit) {
      await productRepository.update(productId, productData);
    } else {
      await productRepository.create(productData);
    }

    res.redirect("/products");
  } catch (error) {
    console.error("❌ Error saving product:", error.message);
    console.error(error.stack);
    res.status(500).send("Something went wrong while saving the product.");
  }
};

// Delete Product
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
