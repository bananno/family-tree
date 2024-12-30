import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';

dotenv.config();

const AWS_REGION = process.env.AWS_REGION;
const S3_BUCKET = process.env.S3_BUCKET;

const s3 = new S3Client({ region: AWS_REGION });

const UploadedFile = mongoose.model('UploadedFile');

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadFileMiddleware = upload.single('file');

export async function uploadFileRoute(req, res) {
  const file = req.file;

  // TODO: customize filename and directories
  const fileKey = file.originalname;

  const uploadedFile = new UploadedFile({ key: fileKey, fileType: 'image' });

  await uploadedFile.save();

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  const s3Response = await s3.send(command);

  uploadedFile.eTag = s3Response.ETag;

  await uploadedFile.save();

  res.send();
}
