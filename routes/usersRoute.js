const express = require("express");
const router = express.Router();
const usersController = require("../controllers/UsersController");
const { addUserValidation } = require("../validators/userValidator");
const { baseRules } = require("../validators/profileValidator");
const { upload, protect } = require("../middleware/authMiddleware");

router.get("/users", protect, usersController.getUserList);
router.get("/getusers", protect, usersController.getAllUsers);

router.get("/adduser", protect, usersController.renderUserForm);

router.get("/users/:id/edit", protect, usersController.renderUserForm);

router.post(
  "/adduser",
  protect,
  upload.single("image"),
  addUserValidation,
  usersController.handleUserSave
);

// POST: Update (Edit)
router.post(
  "/users/:id/edit",
  protect,
  upload.single("image"),
  baseRules,
  usersController.handleUserSave
);

// Delete: Delete User
router.delete("/users/:id", protect, usersController.deleteUser);

module.exports = router;
