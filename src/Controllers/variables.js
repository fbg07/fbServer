import mongoose from "mongoose";

export const addvariables = async (req, res) => {
  try {
    const {
      bhklist,
      propertytypelist,
      constructionstatuslist,
      postedbylist,
      amenitieslist,
      purchasetypelist,
      furnishingstatuslist,
    } = req.body.payload;

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(
      (col) => col.name === "variables"
    );

    if (!collectionExists) {
      await db.collection("variables").insertOne({
        bhklist: bhklist || [],
        propertytypelist: propertytypelist || [],
        constructionstatuslist: constructionstatuslist || [],
        postedbylist: postedbylist || [],
        amenitieslist: amenitieslist || [],
        purchasetypelist: purchasetypelist || [],
        furnishingstatuslist: furnishingstatuslist || [],
      });
      return res.status(201).json({ message: "Collection created and variables added." });
    }

    const existingDoc = await db.collection("variables").findOne({});

    if (!existingDoc) {
      await db.collection("variables").insertOne({
        bhklist: bhklist || [],
        propertytypelist: propertytypelist || [],
        constructionstatuslist: constructionstatuslist || [],
        postedbylist: postedbylist || [],
        amenitieslist: amenitieslist || [],
        purchasetypelist: purchasetypelist || [],
        furnishingstatuslist: furnishingstatuslist || [],
      });
      return res.status(201).json({ message: "New document created." });
    }

    const updatedBhkList = [...new Set([...(existingDoc.bhklist || []), ...(bhklist || [])])];
    const updatedPropertyTypeList = [...new Set([...(existingDoc.propertytypelist || []), ...(propertytypelist || [])])];
    const updatedConstructionStatusList = [...new Set([...(existingDoc.constructionstatuslist || []), ...(constructionstatuslist || [])])];
    const updatedPostedByList = [...new Set([...(existingDoc.postedbylist || []), ...(postedbylist || [])])];
    const updatedAmenitiesList = [...new Set([...(existingDoc.amenitieslist || []), ...(amenitieslist || [])])];
    const updatedPurchaseTypeList = [...new Set([...(existingDoc.purchasetypelist || []), ...(purchasetypelist || [])])];
    const updatedFurnishingStatusList = [...new Set([...(existingDoc.furnishingstatuslist || []), ...(furnishingstatuslist || [])])];

    await db.collection("variables").updateOne(
      {},
      {
        $set: {
          bhklist: updatedBhkList,
          propertytypelist: updatedPropertyTypeList,
          constructionstatuslist: updatedConstructionStatusList,
          postedbylist: updatedPostedByList,
          amenitieslist: updatedAmenitiesList,
          purchasetypelist: updatedPurchaseTypeList,
          furnishingstatuslist: updatedFurnishingStatusList,
        },
      }
    );

    res.status(200).json({ message: "Variables updated successfully." });
  } catch (error) {
    console.error("Error updating variables:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getvariables = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const variables = await db.collection("variables").find({}).toArray();

    if (!variables) {
      return res.status(400).json({
        message: "No variables Found",
      });
    }

    return res.status(200).json({
      payload: variables[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deletevariable = async (req, res) => {
  try {
    const { category, value } = req.body;
    if (!category || !value) {
      return res
        .status(400)
        .json({ message: "Category and value are required" });
    }

    const db = mongoose.connection.db;
    const existingDoc = await db.collection("variables").findOne({});

    if (!existingDoc || !existingDoc[category]) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedList = existingDoc[category].filter((item) => item !== value);

    await db
      .collection("variables")
      .updateOne({}, { $set: { [category]: updatedList } });

    res.status(200).json({ message: "Variable deleted successfully" });
  } catch (error) {
    console.error("Error deleting variable:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
