const categoryRepo = require("../repositories/categoryRepository");
const authRepository = require("../repositories/authRepository");
const { validationResult } = require("express-validator");

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await categoryRepo.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching categories." });
  }
};

exports.renderCategoryListPage = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepository.findById(userId);
    res.render("categorylist", {
      ...user.dataValues,
      breadcrumbs: [
        { label: "Home", url: "/dashboard" },
        { label: "Category" },
      ],
      currentPage: "Category",
      csrfToken: req.csrfToken(),
      user: req.session.user,
      title: "Category",
    });
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};

exports.renderCategoryForm = async (req, res) => {
  try {
    const categoryId = req.params.id;
    let category = null;

    const userId = req.session.user.id;
    const user = await authRepository.findById(userId);

    if (categoryId) {
      category = await categoryRepo.findById(categoryId);
      if (!category) {
        req.session.error = "category not found.";
        req.session.save(() => {
          return res.redirect("/categories");
        });
      }
    }

    const breadcrumbs = [
      { label: "Home", url: "/dashboard" },
      { label: "Categories", url: "/categories" },
      { label: category ? "Edit Category" : "Add Category" },
    ];

    res.render("categoryform", {
      ...user.dataValues,
      title: category ? "Edit Category" : "Add Category",
      currentPage: "Category",
      category,
      breadcrumbs,
      error: req.session.error || null,
      csrfToken: req.csrfToken(),
      user: req.session.user,
    });

    req.session.error = null;
  } catch (error) {
    console.error("Error rendering category form:", error);
    res.status(500).send("Something went wrong.");
  }
};

exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    return req.session.save(() => res.redirect("/addcategory"));
  }

  try {
    const { name, description } = req.body;
    const isActive = req.body.isActive ? true : false;

    if (!name) {
      req.session.error = "Name is required.";
      return req.session.save(() => res.redirect("/addcategory"));
    }

    const existingCategory = await categoryRepo.findByName(name);
    if (existingCategory) {
      req.session.error = "Name already exists.";
      return req.session.save(() => res.redirect("/addcategory"));
    }

    await categoryRepo.create({
      name: name,
      description,
      isActive,
    });

    req.session.save(() => {
      return res.redirect("/categories");
    });
  } catch (error) {
    console.error("Error creating category:", error);
    req.session.error = "Server error while creating category.";
    req.session.save(() => {
      return res.redirect("/categories");
    });
  }
};

exports.updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    return req.session.save(() =>
      res.redirect(`/categories/${req.body.id}/edit`)
    );
  }
  try {
    const { id, name, description } = req.body;
    const isActive = req.body.isActive ? true : false;

    if (!name) {
      req.session.error = "Name is required.";
      req.session.save(() => {
        return res.redirect(`/categories/${id}/edit`);
      });
    }

    const updated = await categoryRepo.update(id, {
      name: name,
      description,
      isActive,
    });

    if (!updated) {
      req.session.error = "Failed to update category.";
      req.session.save(() => {
        return res.redirect("/categories");
      });
    }

    req.session.save(() => {
      return res.redirect("/categories");
    });
  } catch (error) {
    console.error("Error updating category:", error);
    req.session.error = "Server error while updating category.";
    req.session.save(() => {
      return res.redirect(`/categories/${req.body.id}/edit`);
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log("🔍 Delete Request for Category ID:", categoryId);

    const deleted = await categoryRepo.remove(categoryId);
    console.log("🗑 Deleted Result:", deleted);

    if (deleted) {
      return res
        .status(200)
        .json({ success: true, message: "Category deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
  } catch (error) {
    console.error("❌ Error deleting Category:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
