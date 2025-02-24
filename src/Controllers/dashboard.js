import mongoose from "mongoose";

export const getdashboardnumbers = async (req, res) => {
    try {
        const db = mongoose.connection.db;

        // Fetching counts from respective collections
        const users = await db.collection("users").countDocuments({});
        const properties = await db.collection("properties").countDocuments({});
        const brokers = await db.collection("brokers").countDocuments({});

        // Sending the response
        res.status(200).json({
            data: {
                users,
                properties,
                brokers
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard numbers:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
