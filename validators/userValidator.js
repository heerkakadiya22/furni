const { body } = require("express-validator");
const { baseRules } = require("./profileValidator");

const addUserValidation = [
  ...baseRules,

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be between 6 & 10 chars.")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage("Include upper, lower, digit, and special character."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

module.exports = { addUserValidation };
