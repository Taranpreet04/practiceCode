import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.databaseUrl);
        console.log(`MongoDB Connected:, ${conn.connection.host}`, process.env.databaseUrl);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDb;