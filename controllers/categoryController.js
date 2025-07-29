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
      breadcrumbs: [{ label: "Home", url: "/dashboard" }, { label: "Categoy" }],
      currentPage: "Category",
      csrfToken: req.csrfToken(),
      user: req.session.user,
      title: "Category",
    });
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};
