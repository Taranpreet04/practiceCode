import express from 'express';
const router = express.Router();
import { upload } from '../config/multerConfig.js';
import uploadController from '../controllers/uploadController.js';

router.post('/', upload.single('image'), uploadController);

export default router;
