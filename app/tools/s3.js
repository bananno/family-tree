import _ from 'lodash';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const AWS_REGION = process.env.AWS_REGION;
const IMAGE_UPLOAD_S3_BUCKET = process.env.IMAGE_UPLOAD_S3_BUCKET;

// For mocking, not for abstraction. Returns a promise.
export function uploadFileToS3(options) {
  const s3 = new S3Client({ region: AWS_REGION });

  const command = new PutObjectCommand({
    Bucket: IMAGE_UPLOAD_S3_BUCKET,
    ...options,
  });

  return s3.send(command);
}
