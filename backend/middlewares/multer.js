import multer from "multer";
import fs from "fs";
import path from "path";

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, uploadsDir);
  },
  filename(_req, file, callback) {
    const safeName = file.originalname.replace(/[^\w.\-]/g, "_");
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
