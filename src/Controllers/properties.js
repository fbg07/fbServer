import mongoose from "mongoose";

export const addProperties = async (req, res) => {
  try {
    
    
    const data = req.body.payload;
    const db = mongoose.connection.db;

    // Get the last broker's ID and increment it
    const lastProperty = await db
      .collection("properties")
      .findOne({}, { sort: { property_id: -1 } });

    // Set broker ID (auto-increment starting from 100001)
    const propertyId = lastProperty ? lastProperty.property_id + 1 : 100001;

    // Add property_id to data
    const newProperty = { ...data, property_id: propertyId, active: true };

    // Insert new broker
    const insertStatus = await db.collection("properties").insertOne(newProperty);

    if (!insertStatus.acknowledged) {
      return res.status(500).json({ message: "Failed to Add" });
    }

    return res.status(200).json({
      message: "Added Successfully",
      property_id: propertyId,
    });
  } catch (error) {
    console.error("Error in addproperties:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteproperties = async (req, res) => {
  try {
    const { id } = req.body; // Or use req.params.id for DELETE requests
    
    

    if (!id) {
      return res.status(400).json({ message: "Something Went Wrong" });
    }

    const db = mongoose.connection.db;

    const deletestatus = await db.collection("properties").findOneAndDelete(
      { property_id: id }
    );

    if (!deletestatus) {
      return res.status(404).json({
        message: "Property not found or already inactive",
      });
    }

    return res.status(200).json({
      message: "Property Deleted successfully",
      id : id
      
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getproperties = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const propertylist = await db
      .collection("properties")
      .find({ })
      .toArray();

    
    if (!propertylist.length) {
      return res.status(404).json({
        message: "No Properties found",
      });
    }

    return res.status(200).json({
      payload: propertylist,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch broker data at the moment",
    });
  }
};
