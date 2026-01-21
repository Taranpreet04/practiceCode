const uploadController = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        res.json({
            message: "Image uploaded successfully",
            file: req.file,
            url: imageUrl,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    uploadController,
};
