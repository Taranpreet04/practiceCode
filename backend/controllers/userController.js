import User from "../model/users.js";

class UserController {
    static addUser = async (req, res, next) => {
        try {

            const { userName, socketId } = req.body;
            // console.log(req.file)
            let user = new User({
                userName: socketId,
                socketId: socketId,
            })
            await user.save();
            res.send({});
        }
        catch (err) {
            console.log(err);
            // res.send(err);
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
}

export default UserController