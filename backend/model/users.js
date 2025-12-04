// import mongoose from "mongoose";
const mongoose = require('mongoose')

//define schema
const userSchema = mongoose.Schema({
    userName: { type: String, required: true, trim: true },
    socketID: { type: String, required: true, trim: true },
    // password:{type: String, required: true, trim:true},
    // isAdmin:{type: Boolean}
})
//define model-
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;