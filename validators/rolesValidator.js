const { body } = require("express-validator");

exports.roleValidation = [
  // Name
  body("name").notEmpty().withMessage("Name is required"),
  // Description
  body("description")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Description must be less than 255 characters"),
  //active
  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be a boolean value"),
];
