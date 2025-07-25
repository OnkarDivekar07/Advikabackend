const { S3Client, PutObjectCommand,DeleteObjectCommand  } = require("@aws-sdk/client-s3");
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.BUCKET_NAME;


const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  forcePathStyle: true,
});

exports.uploadToS3 = async (image, filename) => {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: filename,
      Body: image,
      ACL: "public-read",
      ContentType: "image/jpeg",
    };
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    const publicUrl = `https://${uploadParams.Bucket}.s3.ap-south-1.amazonaws.com/${uploadParams.Key}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};


exports.deleteFromS3 = async (key) => {
  try {
    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
};