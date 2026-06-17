import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { DeepgramClient } from '@deepgram/sdk';
import ecommerceRoutes from "./ecomerce/index.js";
import { getProperty } from '../controllers/common.js';
import UserController from '../controllers/userController.js';
import { fetchPermisionsByRoleId } from '../controllers/permissions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/* GET home page. */
router.post('/login', UserController.login);
router.post('/register', UserController.addUser);
router.get('/permisions/:roleId', fetchPermisionsByRoleId);
router.post('/send-notification', UserController.sendNotification);

// Multer stores uploaded file to /uploads folder
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file received" });
    }

    const client = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });

    const audioStream = fs.createReadStream(req.file.path);

    const response = await client.listen.v1.media.transcribeFile(
      audioStream,
      {
        model: "nova-3",
        language: "en-US",
        smart_format: true,
      }
    );

    // Clean up uploaded temp file
    fs.unlinkSync(req.file.path);

    const transcript =
      response?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

    console.log("Transcript:", transcript);
    res.json({ transcript });
  } catch (err) {
    // If it's a DeepgramError, we can log it, but otherwise standard error
    console.error("Transcribe route error:", err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Ensure cleanup on error
    }
    res.status(500).json({ error: err.message || "Transcription failed" });
  }
});

router.use("/ecommerce", ecommerceRoutes);

export default router;
