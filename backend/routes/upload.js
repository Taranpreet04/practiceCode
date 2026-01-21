const express = require('express');
const router = express.Router();
const { upload } = require('../config/multerConfig');
const { uploadController } = require('../controllers/uploadController');

router.post('/', upload.single('image'), uploadController);

module.exports = router;
