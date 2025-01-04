const AWS = require("aws-sdk");
const dynamoDb = require("../config/dynamoDbConfig");

const addAssignment = async (req, res) => {
  const { Semester, SubjectId, assignment, price } = req.body;

  // Validate required fields
  if (!Semester || !SubjectId || !assignment || !price) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Construct the saveParams object
  const saveParams = {
    TableName: process.env.TABLE_NAME_ASSIGNMENTS,
    Item: {
      Semester,
      SubjectId,
      assignment,
      price,
    },
  };

  console.log("Saving assignment with params:", saveParams);

  try {
    // Save the item to the DynamoDB table
    await dynamoDb.put(saveParams).promise();
    res.status(200).json({ message: "Assignment added successfully." });
  } catch (error) {
    console.error("Error adding assignment:", error);
    res.status(500).json({ error: "Error adding assignment." });
  }
};

module.exports = {
  addAssignment,
};
