// import mongoose from "mongoose";
const mongoose = require('mongoose')

//define schema
const messageSchema = mongoose.Schema({
    userName: { type: String, required: true, trim: true },
    socketID: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    // isAdmin:{type: Boolean}
})
//define model-
const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel;