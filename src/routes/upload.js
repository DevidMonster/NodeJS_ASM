import express from "express";
import multer from "multer";
import { deleteImage, updateImage, uploadImage } from "../controllers/upload";
const router = express.Router();

const upload = multer({});


router.post("/images/upload", upload.array("images", 10), uploadImage);
router.delete("/images/:publicId", deleteImage);
router.put("/images/:publicId", upload.array("images", 10), updateImage);

export default router;