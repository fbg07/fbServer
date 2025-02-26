import mongoose from "mongoose";

export const addbroker = async (req, res) => {
  try {
    const data = req.body.payload;
    const db = mongoose.connection.db;

    // Get the last broker's ID and increment it
    const lastBroker = await db
      .collection("brokers")
      .findOne({}, { sort: { broker_id: -1 } });

    // Set broker ID (auto-increment starting from 100001)
    const brokerId = lastBroker ? lastBroker.broker_id + 1 : 100001;

    // Add broker_id to data
    const newBroker = { ...data, broker_id: brokerId, active: true };

    // Insert new broker
    const insertStatus = await db.collection("brokers").insertOne(newBroker);

    if (!insertStatus.acknowledged) {
      return res.status(500).json({ message: "Failed to Add" });
    }

    return res.status(200).json({
      message: "Added Successfully",
      broker_id: brokerId,
    });
  } catch (error) {
    console.error("Error in addbroker:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletebroker = async (req, res) => {
  try {
    const { id } = req.body; // Or use req.params.id for DELETE requests

    if (!id) {
      return res.status(400).json({ message: "Broker ID is required" });
    }

    const db = mongoose.connection.db;

    const deletestatus = await db.collection("brokers").findOneAndUpdate(
      { broker_id: id },
      { $set: { active: false } }, // Correct update syntax
      { returnDocument: "after" } // Ensures updated document is returned
    );

    if (!deletestatus) {
      return res.status(404).json({
        message: "Broker not found or already inactive",
      });
    }

    return res.status(200).json({
      message: "Broker deactivated successfully",
      broker_id : id
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getbroker = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const brokerlist = await db
      .collection("brokers")
      .find({ active: true })
      .toArray();

    
    if (!brokerlist.length) {
      return res.status(404).json({
        message: "No brokers found",
      });
    }

    return res.status(200).json({
      payload: brokerlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch broker data at the moment",
    });
  }
};
