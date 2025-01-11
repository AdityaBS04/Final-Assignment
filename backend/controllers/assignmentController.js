const AWS = require("aws-sdk");
const dynamoDb = require("../config/dynamoDbConfig");

const s3 = new AWS.S3();

const getAssignments = async (req, res) => {
  const { Semester, SubjectId } = req.query;

  try {
    if (!Semester || !SubjectId) {
      return res
        .status(400)
        .json({ message: "Semester and SubjectId are required." });
    }

    const params = {
      TableName: process.env.TABLE_NAME_ASSIGNMENTS,
      IndexName: process.env.ASSIGNMENTS_GSI, // GSI for Semester and SubjectId
      KeyConditionExpression:
        "#Semester = :Semester AND #SubjectId = :SubjectId",
      ExpressionAttributeNames: {
        "#Semester": "Semester",
        "#SubjectId": "SubjectId",
      },
      ExpressionAttributeValues: {
        ":Semester": Semester,
        ":SubjectId": SubjectId,
      },
    };

    const data = await dynamoDb.query(params).promise();

    if (!data.Items || data.Items.length === 0) {
      return res.status(404).json({
        message: "No assignments found for the selected semester and subject.",
      });
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

const purchaseAssignment = async (req, res) => {
  const { userEmail, assignmentId, price, assignmentName } = req.body;

  try {
    if (!userEmail || !assignmentId || !price || !assignmentName) {
      return res.status(400).json({
        message:
          "User email, Assignment ID, price, and assignment name are required.",
      });
    }

    const params = {
      TableName: process.env.TABLE_NAME_USER_ASSIGNMENTS,
      Item: {
        userEmail,
        assignmentId,
        assignmentName,
        purchaseDate: new Date().toISOString(),
        price,
      },
    };

    await dynamoDb.put(params).promise();

    res.status(200).json({ message: "Assignment purchased successfully." });
  } catch (error) {
    console.error("Error purchasing assignment:", error);
    res.status(500).json({ message: "Error purchasing assignment." });
  }
};

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { amount } = req.body; // Amount in paise
  try {
    const order = await razorpay.orders.create({
      amount, // Amount in the smallest currency unit (e.g., paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order." });
  }
};



const fetchUserAssignments = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Step 1: Fetch user assignments using userEmail
    const userAssignmentsParams = {
      TableName: process.env.TABLE_NAME_USER_ASSIGNMENTS, // Replace with your user assignments table name
      KeyConditionExpression: "userEmail = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const userAssignments = await dynamoDb.query(userAssignmentsParams).promise();

    if (!userAssignments.Items || userAssignments.Items.length === 0) {
      return res.status(200).json({ assignments: [] });
    }

    // Extract assignmentIds
    const assignmentIds = userAssignments.Items.map((item) => item.assignmentId);

    // Step 2: Fetch assignment details using the new table
    const assignments = [];
    for (const assignmentId of assignmentIds) {
      const assignmentParams = {
        TableName: process.env.TABLE_NAME_ASSIGNMENTS, // New table name
        IndexName: process.env.ASSIGNEMNTID_GSI,          // Use assignmentId GSI
        KeyConditionExpression: "assignmentId = :assignmentId",
        ExpressionAttributeValues: {
          ":assignmentId": assignmentId,
        },
      };

      const assignmentResult = await dynamoDb.query(assignmentParams).promise();
      if (assignmentResult.Items && assignmentResult.Items.length > 0) {
        assignments.push(...assignmentResult.Items);
      }
    }

    if (assignments.length === 0) {
      return res.status(200).json({ assignments: [] });
    }

    // Step 3: Generate signed URLs for S3 files
    const signedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        try {
          // Use the bucket name from the .env file
          const bucketName = process.env.S3_BUCKET_NAME;
    
          if (!bucketName || !assignment.fileLink) {
            throw new Error("Missing bucket name or file path.");
          }
    
          // Generate signed URL for S3 file
          const signedUrl = await s3.getSignedUrlPromise("getObject", {
            Bucket: bucketName, // Bucket name from .env
            Key: assignment.fileLink, // File path from assignment data 
          });
    
          return { ...assignment, signedUrl }; // Append signedUrl to the assignment object
        } catch (error) {
          console.error(
            `Failed to generate signed URL for assignmentId: ${assignment.assignmentId}`,
            error
          );
          throw error; // Handle errors as necessary
        }
      })
    );
    

    res.status(200).json({ assignments: signedAssignments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments." });
  }
};


module.exports = {
  getAssignments,
  purchaseAssignment,
  createOrder,
  fetchUserAssignments,
};
