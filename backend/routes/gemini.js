import express from 'express';
const router = express.Router();
import { geminiController } from '../controllers/geminiController.js';

router.post('/', geminiController);

export default router;
