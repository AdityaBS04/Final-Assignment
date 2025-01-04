const dynamoDb = require("../config/dynamoDbConfig"); // Ensure the correct path to your config

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
  
      res.status(200).json({ message: "Assignments retrieved successfully", assignments: data.Items });
    } catch (error) {
      console.error("Error retrieving assignments:", error);
      res.status(500).json({ message: "Error retrieving assignments" });
    }
  };
  
module.exports = { getAssignments };
  