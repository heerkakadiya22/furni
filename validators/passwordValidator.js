const { body } = require("express-validator");

exports.fpValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

exports.rpValidation = [
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be at least 6, max 10 char.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .withMessage("Password must include upper, lower, number & special char"),
  body("confirmNewPassword")
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

exports.cpValidation = [
  body(["currentPassword", "newPassword", "confirmNewPassword"])
    .notEmpty()
    .withMessage("All fields are required"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("New password must be at least 6, max 10 char.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .withMessage(
      "New password must include upper, lower, number & special char"
    ),
  body("confirmNewPassword")
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
