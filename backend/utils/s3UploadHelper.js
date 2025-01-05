const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadFile = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // Returns the public URL of the file
};

module.exports = { uploadFile };
