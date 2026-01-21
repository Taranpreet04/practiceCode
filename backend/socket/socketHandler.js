const userModel = require("../model/users");
const messageModel = require('../model/messages');

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('------------a user connected----------');

        socket.on('message', async (data, callback) => {
            try {
                console.log("data", data);
                let message = new messageModel(data);
                await message.save();
                let msg = await userModel.find();
                callback(msg);
            } catch (err) {
                console.error("Socket Message Error:", err);
            }
        });

        socket.on('newUser', async (data, callback) => {
            try {
                let userExist = await userModel.findOne({ userName: data?.userName });
                if (!userExist) {
                    let user = new userModel(data);
                    await user.save();
                    callback(data);
                } else {
                    callback(userExist);
                }
            } catch (err) {
                console.error("Socket New User Error:", err);
            }
        });

        socket.on('requestUserData', async () => {
            try {
                let data = await userModel.find();
                socket.emit('userData', data);
            } catch (error) {
                socket.emit('userDataError', { message: 'Failed to fetch data' });
            }
        });

        socket.on('requestUserMessages', async () => {
            try {
                let data = await messageModel.find();
                console.log("data from db==", data);
                socket.emit('messageData', data);
            } catch (error) {
                socket.emit('userDataError', { message: 'Failed to fetch data' });
            }
        });

        socket.on('disconnect', async () => {
            console.log('🔥: A user disconnected');
            try {
                let users = await userModel.find();
                console.log("users at end--", users);
                socket.emit('userData', users);
            } catch (error) {
                console.error("Socket Disconnect Error:", error);
            }
            socket.disconnect();
        });
    });
};

module.exports = socketHandler;
