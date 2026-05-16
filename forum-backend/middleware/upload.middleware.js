const fs = require("fs");
const path = require("path");
const multer = require("multer");

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const targetDir = path.join(__dirname, "..", "public", "uploads");
    fs.mkdirSync(targetDir, { recursive: true });
    cb(null, targetDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadAvatar,
};
