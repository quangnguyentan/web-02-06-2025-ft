import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../assets/images");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedImageTypes = /jpeg|jpg|png/;
    const allowedVideoTypes = /mp4|mov|avi/;
    const mimetype =
        allowedImageTypes.test(file.mimetype) || allowedVideoTypes.test(file.mimetype);
    const extname =
        allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
        allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ chấp nhận file ảnh (.jpg, .jpeg, .png) hoặc video (.mp4, .mov, .avi)"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});