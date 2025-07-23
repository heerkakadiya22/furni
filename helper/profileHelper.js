const path = require("path");
const fs = require("fs");

const DEFAULT_IMAGE = "/assets/admin/img/user/default.jpg";

// Return final image path - use uploaded file or keep existing or default

const getImagePath = (req, existingImage) => {
  if (req.file) {
    return "/assets/admin/img/user/" + req.file.filename;
  }
  return existingImage || DEFAULT_IMAGE;
};

//  Ensure hobbies input is always an array

const formatHobbies = (hobbyInput) => {
  if (!hobbyInput) return "";
  if (Array.isArray(hobbyInput)) return hobbyInput.join(", ");
  return hobbyInput;
};

/**
 * Delete the old image from server if it's not the default
 */
const deleteOldImageIfNeeded = (imagePathFromDB) => {
  const defaultFilename = path.basename(DEFAULT_IMAGE);
  const imageFilename = path.basename(imagePathFromDB || "");

  if (!imageFilename || imageFilename === defaultFilename) return;

  const fullPath = path.join(
    __dirname,
    "../assets/admin/img/user",
    imageFilename
  );

  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("❌ Failed to delete image:", err);
    } else if (!err) {
      console.log("🗑️ Deleted image:", imageFilename);
    } else {
      console.warn("⚠️ Image not found:", fullPath);
    }
  });
};

module.exports = {
  getImagePath,
  formatHobbies,
  deleteOldImageIfNeeded,
  DEFAULT_IMAGE,
};
