import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "D:/Project/UniKitab2/apps/backend/src/utils/drive");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});
