
import { encrypt, decrypt } from "../utils/security.js";
import mongoose from "mongoose";

const checkExisting = async (email) => {
    try {
        const db = mongoose.connection.db;
        return await db.collection("admin").findOne({ email });
    } catch (error) {
        console.error("Error in checkExisting:", error);
        throw new Error("Database error");
    }
};

const verification = async (email, password) => {
    try {
        const db = mongoose.connection.db;
        const admin = await db.collection("admin").findOne({ email });

        if (!admin) {
            throw new Error("Admin not found");
        }

        const decryptedpassword = decrypt(admin.password);

        
        
        

        if (decryptedpassword.password != password) {
            throw new Error("Incorrect Password");
        }

        return true;
    } catch (error) {
        console.error("Error in verification:", error);
        throw new Error(error.message);
    }
};

export const adminlogin = async (req, res) => {
    try {
       
        
        const decrypteddata = decrypt(req.body.payload);

        
        
        
        

        if (!decrypteddata.email || !decrypteddata.password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const admin = await checkExisting(decrypteddata.email);

        if (!admin) {
            return res.status(404).json({ message: "Wrong Email or Mobile" });
        }

        const isVerified = await verification(decrypteddata.email, decrypteddata.password);

        if (!isVerified) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        return res.status(200).json({ message: "Login Successful" });

    } catch (error) {
        console.error("Error in adminlogin:", error);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
