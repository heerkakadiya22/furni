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
const deleteOldImageIfNeeded = (oldImageFilename) => {
  const defaultFilename = path.basename(DEFAULT_IMAGE);
  if (!oldImageFilename || oldImageFilename === defaultFilename) return;

  const oldImagePath = path.join(
    __dirname,
    "../public/assets/admin/img/user/",
    oldImageFilename
  );

  if (fs.existsSync(oldImagePath)) {
    fs.unlink(oldImagePath, (err) => {
      if (err) console.error("❌ Failed to delete old image:", err);
      else console.log("🗑️ Deleted old image:", oldImageFilename);
    });
  }
};

module.exports = {
  getImagePath,
  formatHobbies,
  deleteOldImageIfNeeded,
  DEFAULT_IMAGE,
};
