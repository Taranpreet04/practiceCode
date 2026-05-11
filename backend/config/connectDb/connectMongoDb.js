import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.databaseUrl);
        // const conn = await mongoose.connect(process.env.databaseUrl);
        console.log(`MongoDB local Connected:, ${conn.connection.host}`, process.env.databaseUrl);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDb;

//mongodb+srv://taranofficialacc_db_user:taran@123@cluster0.u3spayq.mongodb.net/myDbApp
//taran@123