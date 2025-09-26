const authRepo = require("../repositories/authRepository");
const {
  getImagePath,
  formatHobbies,
  deleteOldImageIfNeeded,
} = require("../helper/profileHelper");
const { validationResult } = require("express-validator");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await authRepo.findById(userId);

    const success = req.session.success || null;
    const error = req.session.error || null;
    req.session.success = null;
    req.session.error = null;

    res.render("user-profile", {
      title: "Edit Profile",
      ...user.dataValues,
      currentPage: "profile",
      csrfToken: req.csrfToken(),
      user: req.session.user,
      session: req.session,
      success,
      error,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    req.session.error = "Unable to load profile.";
    req.session.save(() => {
      res.redirect("/index");
    });
  }
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("🔴 Validation errors:", errors.array());

    req.session.error = errors
      .array()
      .map((err) => err.msg)
      .join("<br>");
    return req.session.save(() => {
      res.redirect("/user-profile");
    });
  }

  try {
    const userId = req.session.user.id;
    const { name, email, phone, username, address, dob, gender } = req.body;

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
      image: imagePath,
    });

    if (updatedRows === 0) {
      req.session.error = "No changes were made to the profile.";
    } else {
      req.session.success = "Profile updated successfully!";
    }

    req.session.save(() => {
      res.redirect("/user-profile");
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    console.error("🔍 Stack Trace:", error.stack);
    req.session.error = "Something went wrong while updating your profile.";
    req.session.save(() => {
      res.redirect("/user-profile");
    });
  }
};
