import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const upload = multer(); // memory storage

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
//  app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     const file = req.file;

//     const command = new PutObjectCommand({
//       Bucket: "your-bucket-name",
//       Key: Date.now() + "-" + file.originalname,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     });

//     await s3.send(command);

//     res.json({ message: "File uploaded successfully 🎉" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

const uploadController = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
   

app.listen(5000, () => console.log("Server running"));


};

export default uploadController;
