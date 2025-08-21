const multer = require("multer");
const path = require("path");
const fs = require("fs");

//for image
const uploadDir = path.join(__dirname, "../assets/admin/img/products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log("📂 Multer sees file:", file.fieldname, file.originalname);
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

const deleteOldImage = (imagePathFromDB) => {
  if (!imagePathFromDB) return;

  const imageFilename = path.basename(imagePathFromDB);
  const fullPath = path.join(
    __dirname,
    "../assets/admin/img/products",
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

// function getImagePath(req, oldImage) {
//   if (req.file) {
//     return req.file.filename;
//   }
//   return oldImage || null;
// }

function getMainImage(req, oldImage) {
  if (req.files && req.files.main_img && req.files.main_img[0]) {
    return req.files.main_img[0].filename;
  }
  return oldImage || null;
}

function getSubImages(req, oldSubImages) {
  if (req.files && req.files.sub_img && req.files.sub_img.length > 0) {
    return req.files.sub_img.map((f) => f.filename).join(",");
  }
  return oldSubImages || null;
}

module.exports = {
  upload,
  deleteOldImage,
  getMainImage,
  getSubImages,
};
