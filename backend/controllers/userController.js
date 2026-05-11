import User from "../model/users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from "../helpers/bcrpt.js";
import admin from "firebase-admin";

class UserController {
    static addUser = async (req, res, next) => {
        try {

            const { userName, socketId, fcmToken, password, email } = req.body;
            const encPass = bcrypt.hashSync(password, 10);
            let user = new User({
                userName: userName,
                email: email,
                socketId: socketId,
                fcmToken: fcmToken,
                password: encPass,
            })
            await user.save();
            res.send({ success: true, message: "User added successfully" });
        }
        catch (err) {
            console.log(err);
            res.send({ success: false, message: "User not added" });
        }
    }

    static getUsers = async (req, res, next) => {
        try {
            let users = await User.find();
            res.json(users);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
    static login = async (req, res, next) => {
        try {
            const { password, email, fcmToken } = req.body;
            const isUserExsist = await User.findOne({ email: email });
            if (!isUserExsist) {
                return res.send({ success: false, message: "User not found" });
            }
            const check = await comparePassword(password, isUserExsist?.password);
            if (!check) {
                return res.send({ success: false, message: "Password not match" });
            }
            if (fcmToken) {
                isUserExsist.fcmToken = fcmToken;
            }
            await isUserExsist.save();
            const token = jwt.sign({ id: isUserExsist._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.send({ success: true, message: "User found", user: { id: isUserExsist?._id, email: email, userName: isUserExsist?.userName, fcmToken: isUserExsist?.fcmToken, token: token } });
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
    static sendNotification = async (req, res, next) => {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const user = await User.findOne({ _id: userId });

            if (!user || !user.fcmToken) {
                console.log("User or Token not found for ID:", userId);
                return res.status(400).json({ message: "User token not found" });
            }

            console.log("FCM Token:", user.fcmToken);

            const message = {
                token: user.fcmToken,
                notification: {
                    title: "Hello",
                    body: "This is a test notification",
                },
                // data: {
                //     url: "http://localhost:4000",
                // }
            };
            console.log("Message:", message);

            const response = await admin.messaging().send(message);

            res.json({ success: true, response });
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
}

export default UserController