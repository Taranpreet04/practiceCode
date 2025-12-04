const mongoose = require("mongoose");

const connectDb = () => {
    let data = {
        dbName: "chatApp",
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    }
    mongoose.connect(process.env.databaseUrl, data).then(() =>
        console.log(
            "Connected to yourDB-name database")
    );
}
module.exports = connectDb;