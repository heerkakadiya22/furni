const path = require("path");

const DEFAULT_IMAGE = "/assets/admin/img/user/default.jpg";

/**
 * Return final image path - use uploaded file or keep existing or default
 */
const getImagePath = (req, existingImage) => {
  if (req.file) {
    return "/assets/admin/img/user/" + req.file.filename;
  }
  return existingImage || DEFAULT_IMAGE;
};

/**
 * Ensure hobbies input is always an array
 */
const formatHobbies = (hobbyInput) => {
  if (!hobbyInput) return "";
  if (Array.isArray(hobbyInput)) return hobbyInput.join(", ");
  return hobbyInput;
};

module.exports = {
  getImagePath,
  formatHobbies,
  DEFAULT_IMAGE,
};
