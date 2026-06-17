import mongoose from "mongoose";

const vlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Vlog", vlogSchema);