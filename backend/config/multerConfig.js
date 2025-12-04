const multer = require("multer");
const path = require("path");


// Storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Folder to save uploaded images
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

// Only allow images
const fileFilter = (req, file, cb) => {
    const allowed = /jpg|jpeg|png|gif/;
    const isValid = allowed.test(file.mimetype);

    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error("Only image files allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
});
module.exports = { upload };
