// controllers/assignmentController.js
const dynamoDb = require("../config/dynamoDbConfig");

const getAssignments = async (req, res) => {
  const { Semester, SubjectId } = req.query;

  try {
    if (!Semester || !SubjectId) {
      return res.status(400).json({ message: "Semester and SubjectId are required." });
    }

    const params = {
      TableName: process.env.TABLE_NAME_ASSIGNMENTS,
      IndexName: process.env.ASSIGNMENTS_GSI, // GSI for Semester and SubjectId
      KeyConditionExpression: "#Semester = :Semester AND #SubjectId = :SubjectId",
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

const purchaseAssignment = async (req, res) => {
  const { userEmail, assignmentId, price, assignmentName } = req.body;

  try {
    if (!userEmail || !assignmentId || !price || !assignmentName) {
      return res.status(400).json({ message: "User email, Assignment ID, price, and assignment name are required." });
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



module.exports = { getAssignments, purchaseAssignment,createOrder };

