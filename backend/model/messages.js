import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    userName: { type: String, required: true, trim: true },
    socketID: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
});

const Message = mongoose.model("messages", messageSchema);
export default Message;