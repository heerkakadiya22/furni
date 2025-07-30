const { body } = require("express-validator");

exports.categoryValidation = [
  // Name
  body("name").notEmpty().withMessage("Name is required"),
  // Description
  body("description")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Description must be less than 255 characters"),
];
