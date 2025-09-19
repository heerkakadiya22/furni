const { body } = require("express-validator");

exports.categoryValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Description must be less than 255 characters"),
];
