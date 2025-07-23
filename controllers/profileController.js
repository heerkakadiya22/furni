const authRepo = require("../repositories/authRepository");
const roleRepo = require("../repositories/roleRepository");
const {
  getImagePath,
  formatHobbies,
  deleteOldImageIfNeeded,
} = require("../helper/profileHelper");
const { validationResult } = require("express-validator");

const getProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepo.findById(userId);
    const roles = await roleRepo.findAll();

    user.hobby = user.hobby ? user.hobby.split(",").map((h) => h.trim()) : [];

    const success = req.session.success || null;
    const error = req.session.error || null;
    req.session.success = null;
    req.session.error = null;

    console.log("✅ Gender from DB:", user.gender);
    res.render("profile", {
      title: "Edit Profile",
      breadcrumbs: [
        { label: "Dashboard", url: "/dashboard" },
        { label: "Profile" },
      ],
      ...user.dataValues,
      roles,
      roleId: user.roleId,
      currentPage: "profile",
      csrfToken: req.csrfToken(),
      user: req.session.user,
      success,
      error,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    req.session.error = "Unable to load profile.";
    req.session.save(() => {
      res.redirect("/dashboard");
    });
  }
};

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("🔴 Validation errors:", errors.array());

    req.session.error = "Please correct the errors in your form.";
    return req.session.save(() => {
      res.redirect("/profile"); // ✅ return here to stop further execution
    });
  }
  try {
    const userId = req.session.user.id;
    const { name, email, phone, username, address, dob, gender, roleId } =
      req.body;

    const hobbies = formatHobbies(req.body.hobby);
    const user = await authRepo.findById(userId);

    if (!user) throw new Error("User not found");

    if (req.file && user.image) {
      deleteOldImageIfNeeded(user.image);
    }

    const imagePath = getImagePath(req, user.image);

    const [updatedRows] = await authRepo.update(userId, {
      name,
      email,
      phone,
      username,
      address,
      dob,
      gender,
      hobby: hobbies,
      roleId,
      image: imagePath,
    });

    if (updatedRows === 0) {
      req.session.error = "No changes were made to the profile.";
    } else {
      req.session.success = "Profile updated successfully!";
    }

    req.session.save(() => {
      res.redirect("/profile");
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    console.error("🔍 Stack Trace:", error.stack);
    req.session.error = "Something went wrong while updating your profile.";
    req.session.save(() => {
      res.redirect("/profile");
    });
  }
};

module.exports = { getProfile, updateProfile };
