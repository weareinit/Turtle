import path from "path";
import multer from "multer";

const storage = multer.memoryStorage();

const extractResume = multer({
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const ext = filetypes.test(path.extname(file.originalname).toLowerCase());
    mimetype && ext ? cb(null, true) : cb("Invalid file type.", false);
  },
  storage
}).single("resume");

export default { extractResume };
