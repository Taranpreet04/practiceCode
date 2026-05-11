// import mongoose from "mongoose";
import mongoose from 'mongoose';

//define schema
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, trim: true },
    socketID: { type: String, required: true, trim: true },
    fcmToken: { type: String, trim: true, sparse: true },
    password: { type: String, required: true, trim: true },
    // isAdmin:{type: Boolean}
});
//define model-
const User = mongoose.model('User', userSchema);

export default User;