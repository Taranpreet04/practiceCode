import mongoose from 'mongoose';

const importedPinSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    pinId: { type: String, required: true },
    localUrl: { type: String, required: true },
    originalUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

importedPinSchema.index({ userId: 1, pinId: 1 }, { unique: true });

const ImportedPin = mongoose.model('ImportedPin', importedPinSchema);
export default ImportedPin;
