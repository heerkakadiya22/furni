const roleRepository = require("../repositories/roleRepository");
const authRepository = require("../repositories/authRepository");
const {
  getImagePath,
  formatHobbies,
  deleteOldImageIfNeeded,
} = require("../helper/profileHelper");
const { validationResult } = require("express-validator");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await authRepository.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Server error while fetching roles." });
  }
};

exports.getUserList = async (req, res) => {
  try {
    const users = await authRepository.findAll();
    const userId = req.session.user.id;
    const user = await authRepository.findById(userId);
    res.render("userList", {
      ...user.dataValues,
      users,
      user: req.session.user,
      csrfToken: req.csrfToken(),
      currentPage: "users",
      title: "Users List",
      breadcrumbs: [{ label: "Home", url: "/dashboard" }, { label: "Users" }],
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).send("Something went wrong while fetching users.");
  }
};

exports.renderUserForm = async (req, res) => {
  const userId = req.params.id;
  const isEdit = !!userId;

  try {
    const roles = await roleRepository.findAll();

    let formData = {
      name: "",
      email: "",
      phone: "",
      username: "",
      roleId: "",
      address: "",
      gender: "",
      dob: "",
      image: "",
      hobby: [],
    };

    if (isEdit) {
      const user = await authRepository.findById(userId);
      if (!user) return res.status(404).send("User not found");

      formData = {
        ...user.dataValues,
      };
    }

    const currentUser = await authRepository.findById(req.session.user.id);
    const profileImage =
      currentUser?.image && currentUser.image !== ""
        ? `${currentUser.image}`
        : `/assets/admin/img/user/default.jpg`;

    res.render("userForm", {
      title: isEdit ? "Edit User" : "Add User",
      user: req.session.user,
      formData,
      image: profileImage,
      isEdit,
      roles,
      error: null,
      csrfToken: req.csrfToken(),
      currentPage: "users",
      breadcrumbs: [
        { label: "Dashboard", url: "/dashboard" },
        { label: "Users", url: "/users" },
        { label: isEdit ? "Edit User" : "Add User" },
      ],
    });
  } catch (error) {
    console.error("Error rendering user form:", error);
    res.status(500).send("Server Error");
  }
};

// POST: Save or Update User
exports.handleUserSave = async (req, res) => {
  // ✅ Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.error = "Please correct the errors in your form.";
    return req.session.save(() => {
      const redirectUrl = isEdit ? `/users/${userId}/edit` : "/adduser";
      res.redirect(redirectUrl);
    });
  }

  const isEdit = !!req.params.id;
  const userId = req.params.id;
  const formData = req.body;

  try {
    let existingUser = null;
    if (isEdit) {
      existingUser = await authRepository.findById(userId);
      if (!existingUser) {
        return res.status(404).send("User not found.");
      }

      // ✅ Delete old image if a new one is uploaded
      if (req.file && existingUser.image) {
        deleteOldImageIfNeeded(existingUser.image);
      }
    }

    // ✅ Always get updated image path: new or fallback to old
    const imagePath = getImagePath(req, existingUser?.image);
    const hobbies = formatHobbies(formData.hobby);

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      username: formData.username,
      roleId: formData.roleId,
      address: formData.address,
      gender: formData.gender,
      dob: formData.dob || null,
      image: imagePath,
      hobby: hobbies,
    };

    if (!isEdit && formData.password) {
      userData.password = formData.password;
    }

    if (isEdit) {
      await authRepository.update(userId, userData);
    } else {
      await authRepository.createUser(userData);
    }

    res.redirect("/users");
  } catch (error) {
    console.error("❌ Error saving user:", error.message);
    console.error("📦 Full Error Stack:", error.stack);
    console.error("Error saving user:", error);
    res.status(500).send("Something went wrong while saving the user.");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("🔍 Delete Request for ID:", userId);

    const deleted = await authRepository.deleteUser(userId);
    console.log("🗑 Deleted Count:", deleted);

    if (deleted) {
      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
