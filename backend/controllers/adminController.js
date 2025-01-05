const multer = require("multer");
const { uploadFile } = require("../utils/s3UploadHelper");
const dynamoDb = require("../config/dynamoDbConfig");

// Multer configuration for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Add assignment with file upload
const addAssignmentWithFile = async (req, res) => {
  const { Semester, SubjectId, assignment, price } = req.body;

  if (!Semester || !SubjectId || !assignment || !price || !req.file) {
    return res.status(400).json({ message: "All fields and a file are required." });
  }

  try {
    // Upload the file to S3
    const fileLink = await uploadFile(req.file);

    // Prepare assignment details to save in DynamoDB
    const newAssignment = {
      Semester,
      SubjectId,
      assignment,
      price,
      fileLink,
      createdAt: new Date().toISOString(), // Add a timestamp for record tracking
    };

    const saveParams = {
      TableName: process.env.TABLE_NAME_ASSIGNMENTS,
      Item: newAssignment,
    };

    // Save to DynamoDB
    await dynamoDb.put(saveParams).promise();

    res.status(201).json({ message: "Assignment added successfully" });
  } catch (error) {
    console.error("Error adding assignment:", error);
    res.status(500).json({ message: "Error adding assignment." });
  }
};

// Get assignments based on Semester and SubjectId
const getAssignments = async (req, res) => {
  const { Semester, SubjectId } = req.query;

  try {
    if (!Semester || !SubjectId) {
      return res.status(400).json({ message: "Semester and SubjectId are required." });
    }

    const params = {
      TableName: process.env.TABLE_NAME_ASSIGNMENTS,
      FilterExpression: "#Semester = :semester AND #SubjectId = :subjectId",
      ExpressionAttributeNames: {
        "#Semester": "Semester",
        "#SubjectId": "SubjectId",
      },
      ExpressionAttributeValues: {
        ":semester": Semester,
        ":subjectId": SubjectId,
      },
    };

    const data = await dynamoDb.scan(params).promise();

    if (!data.Items || data.Items.length === 0) {
      return res.status(404).json({ message: "No assignments found for the selected semester and subject." });
    }

    res.status(200).json({
      message: "Assignments retrieved successfully",
      assignments: data.Items, // Include fileLink in the response
    });
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    res.status(500).json({ message: "Error retrieving assignments." });
  }
};

module.exports = { addAssignmentWithFile, getAssignments, upload };
