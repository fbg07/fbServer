
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URL = process.env.DB || "mongodb+srv://fbuser:fb%4007@fbcluster.4zo1d.mongodb.net/?retryWrites=true&w=majority&appName=fbcluster/FBRentals";


const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(DB_URL);
        console.log(`Connected to MongoDB: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection FAILED", error);
        process.exit(1);
    }
}

export default ConnectDB;
