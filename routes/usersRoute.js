const express = require("express");
const router = express.Router();
const usersController = require("../controllers/UsersController");

const { upload, protect } = require("../middleware/authMiddleware");

router.get("/users", usersController.getUserList);
router.get("/getusers/api", usersController.getAllUsers);

router.get("/adduser", protect, usersController.renderUserForm);

router.get("/users/:id/edit", protect, usersController.renderUserForm);

router.post(
  "/adduser",
  protect,
  upload.single("image"),
  usersController.handleUserSave
);

// POST: Update (Edit)
router.post(
  "/users/:id/edit",
  protect,
  upload.single("image"),
  usersController.handleUserSave
);

// Delete: Delete User
router.delete("/users/:id", protect, usersController.deleteUser);

module.exports = router;
