const mongoose = require('mongoose');

const pinterestTokenSchema = mongoose.Schema({
    userName: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });
    
const PinterestToken = mongoose.model("PinterestToken", pinterestTokenSchema);

module.exports = PinterestToken;
