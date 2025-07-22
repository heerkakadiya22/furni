const { body } = require("express-validator");

const baseRules = [
  body("name")
    .notEmpty()
    .matches(/^[A-Za-z ]+$/)
    .withMessage("Name must contain only letter"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("username")
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters"),

  body("address")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Address must be less than 200 characters"),

  body("gender")
    .optional()
    .customSanitizer((value) => value?.toLowerCase())
    .isIn(["male", "female"])
    .withMessage("Gender must be male or female"),

  body("hobby").optional(),
];

module.exports = { baseRules };
