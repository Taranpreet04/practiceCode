const mongoose = require('mongoose');

const importedPinSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    pinId: { type: String, required: true },
    localUrl: { type: String, required: true },
    originalUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Avoid duplicate imports for the same user and pin
importedPinSchema.index({ userId: 1, pinId: 1 }, { unique: true });

module.exports = mongoose.model('ImportedPin', importedPinSchema);
