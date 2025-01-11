const multer = require("multer");
const { uploadFile } = require("../utils/s3UploadHelper");
const dynamoDb = require("../config/dynamoDbConfig");
const { v4: uuidv4 } = require("uuid"); 

// Multer configuration for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Add assignment with file upload
const addAssignmentWithFile = async (req, res) => {
  const { Semester, SubjectId, assignment, price } = req.body;

  // Validate input
  if (!Semester || !SubjectId || !assignment || !price || !req.file) {
    return res.status(400).json({ message: "All fields and a file are required." });
  }

  try {
    // Upload the file to S3 and get the file link
    const fileLink = await uploadFile(req.file);

    // Generate a unique assignment ID
    const assignmentId = uuidv4();

    // Prepare assignment details to save in DynamoDB
    const newAssignment = {
      assignmentId, // Partition key
      SubjectId, // Sort key
      Semester,
      assignmentName: assignment,
      price: parseFloat(price), // Ensure price is saved as a number
      fileLink,
      createdAt: new Date().toISOString(), // Add a timestamp for record tracking
    };

    const saveParams = {
      TableName: process.env.TABLE_NAME_ASSIGNMENTS,
      Item: newAssignment,
    };

    // Save to DynamoDB
    await dynamoDb.put(saveParams).promise();

    res.status(201).json({ message: "Assignment added successfully", assignment: newAssignment });
  } catch (error) {
    console.error("Error adding assignment:", error);
    res.status(500).json({ message: "Error adding assignment." });
  }
};

// Get assignments based on Semester and SubjectId
const getAssignments = async (req, res) => {
  const { Semester, SubjectId } = req.query;

  // Validate input
  if (!Semester || !SubjectId) {
    return res.status(400).json({ message: "Semester and SubjectId are required." });
  }

  try {
    // Query DynamoDB to fetch assignments for the given SubjectId
    const params = {
      TableName: process.env.TABLE_NAME_ASSIGNMENTS,
      KeyConditionExpression: "SubjectId = :subjectId",
      FilterExpression: "#Semester = :semester",
      ExpressionAttributeNames: {
        "#Semester": "Semester",
      },
      ExpressionAttributeValues: {
        ":subjectId": SubjectId,
        ":semester": Semester,
      },
    };

    const data = await dynamoDb.query(params).promise();

    if (!data.Items || data.Items.length === 0) {
      return res.status(404).json({ message: "No assignments found for the selected semester and subject." });
    }

    res.status(200).json({
      message: "Assignments retrieved successfully",
      assignments: data.Items,
    });
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    res.status(500).json({ message: "Error retrieving assignments." });
  }
};

module.exports = { addAssignmentWithFile, getAssignments, upload };
