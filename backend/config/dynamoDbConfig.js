const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

console.log("AWS Region:", process.env.AWS_REGION);
console.log("Access Key ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("Secret Access Key:", process.env.AWS_SECRET_ACCESS_KEY ? "Loaded" : "Missing");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;
