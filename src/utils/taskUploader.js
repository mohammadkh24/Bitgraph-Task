const path = require("path");
const multer = require("multer");

// نوع فایل‌های مجاز
const allowedMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "application/zip",
  "application/x-rar-compressed",
  "application/octet-stream",
  "application/postscript",  
  "image/vnd.adobe.photoshop" 
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("فرمت فایل مجاز نیست"), false);
  }
};

// تنظیمات ذخیره‌سازی فایل‌ها
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..","public", "tasks" ));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e6) + ext;
    cb(null, uniqueName);
  },
});

const limits = {
  fileSize: 30 * 1024 * 1024, // 30MB
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
