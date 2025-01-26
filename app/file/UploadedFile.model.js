import _ from 'lodash';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const AWS_REGION = process.env.AWS_REGION;
const IMAGE_UPLOAD_S3_BUCKET = process.env.IMAGE_UPLOAD_S3_BUCKET;
const PUBLIC_IMAGE_URL = process.env.IMAGE_HOSTING_PATH;

const schema = new mongoose.Schema(
  {
    eTag: String,
    key: {
      type: String,
      required: true,
      unique: true,
    },
    // fileType = "image" or... other? support PDFs eventually
    fileType: {
      type: String,
      required: true,
    },
    mimeType: String,
    size: Number,
  },
  { timestamps: true },
);

schema.methods.toApi = function () {
  return {
    id: this.id,
    filename: this.key,
    url: this.url(),
  };
};

schema.methods.url = function () {
  return `${PUBLIC_IMAGE_URL}/${this.key}`;
};

// Before calling: create and save the UploadedFile with a key, fileType, and mimeType.
// Then call executeUpload with the original uploaded file as an argument.
schema.methods.executeUpload = async function (file) {
  const s3 = new S3Client({ region: AWS_REGION });

  const command = new PutObjectCommand({
    Bucket: IMAGE_UPLOAD_S3_BUCKET,
    Key: this.key,
    Body: file.buffer,
    ContentType: this.mimeType,
  });

  const s3Response = await s3.send(command);

  this.eTag = s3Response.ETag;

  await this.save();
};

const UploadedFile = mongoose.model('UploadedFile', schema);

export default UploadedFile;
