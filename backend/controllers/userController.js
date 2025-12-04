var userModel = require("../model/users");
class UserController {
    static addUser = async (req, res, next) => {
        try {

            const { userName, socketId } = req.body;
            // console.log(req.file)
            let user = await new userModel({
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
            try{
                let users = userModel.find();
            }
            catch (err) {
                console.log(err);
                res.send(err);
            }
    }
}

module.exports = UserController