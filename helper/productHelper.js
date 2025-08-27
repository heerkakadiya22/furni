const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../assets/admin/img/products"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) cb(null, true);
  else cb(new Error("Only image files are allowed!"));
};

const upload = multer({ storage, fileFilter });

function deleteOldImage(imagePathFromDB) {
  if (imagePathFromDB) {
    const fullPath = path.join(
      __dirname,
      "../assets/admin/img/products",
      imagePathFromDB
    );
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
}

function getMainImage(req, oldImage) {
  const mainFile = req.files.find((f) => f.fieldname === "main_img");
  if (mainFile) {
    if (oldImage) deleteOldImage(oldImage);
    return mainFile.filename;
  }
  return oldImage;
}

function getSubImages(req, oldSubImages) {
  let subImages = oldSubImages ? oldSubImages.split(",") : [];

  const replaceFiles = req.files.filter((f) =>
    f.fieldname.startsWith("replace_sub_img")
  );
  replaceFiles.forEach((file) => {
    const match = file.fieldname.match(/\[(\d+)\]/);
    if (match) {
      const index = parseInt(match[1]);
      const oldFile = req.body[`replace_old_${index}`];
      if (oldFile) deleteOldImage(oldFile);
      subImages[index] = file.filename;
    }
  });

  const newSubFiles = req.files.filter((f) => f.fieldname === "sub_img");
  if (newSubFiles.length > 0) {
    subImages = subImages.concat(newSubFiles.map((f) => f.filename));
  }

  return subImages.join(",");
}

module.exports = { upload, deleteOldImage, getMainImage, getSubImages };
