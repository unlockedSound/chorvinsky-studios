const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return s3.upload(params).promise();
};

const generateSignedUrl = (s3Key, expiresIn = 3600) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key,
    Expires: expiresIn, // URL expires in 1 hour by default
  };
  return s3.getSignedUrl('getObject', params);
};

module.exports = { s3, uploadToS3, generateSignedUrl }; 