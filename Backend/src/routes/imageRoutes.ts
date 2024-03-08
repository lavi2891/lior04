import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/imageController';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), uploadImage);

export default router;
