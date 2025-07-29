const multer = require("multer");
const path = require("path");
const fs = require("fs");
const registerRepo = require("../repositories/authRepository");

async function protect(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/");
  }

  try {
    const freshUser = await registerRepo.findById(req.session.user.id);
    if (freshUser?.roleId === 1) {
      req.session.user.roleId = 1;
      return next();
    }
  } catch (error) {
    console.error("Protect middleware error:", error);
  }
  return res.redirect("/");
}


//for image
const uploadDir = path.join(__dirname, "../assets/admin/img/user");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      const error = new Error("Only images allowed (jpeg, jpg, png, gif)");
      error.code = "INVALID_FILETYPE";
      return cb(error);
    }
  },
});

module.exports = {
  upload,
  protect,
};
