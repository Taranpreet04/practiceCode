const express = require('express');
const router = express.Router();
const { geminiController } = require('../controllers/geminiController');

router.post('/', geminiController);

module.exports = router;
