import _ from 'lodash';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';

dotenv.config();

const AWS_REGION = process.env.AWS_REGION;
const IMAGE_UPLOAD_S3_BUCKET = process.env.IMAGE_UPLOAD_S3_BUCKET;

const s3 = new S3Client({ region: AWS_REGION });

const UploadedFile = mongoose.model('UploadedFile');

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadFileMiddleware = upload.single('file');

export async function createUploadedFileRoute(req, res) {
  const file = req.file;
  const fileKey = req.body.filename || file.originalname;

  const uploadedFile = new UploadedFile({ key: fileKey, fileType: 'image' });

  await uploadedFile.save();

  const command = new PutObjectCommand({
    Bucket: IMAGE_UPLOAD_S3_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  const s3Response = await s3.send(command);

  uploadedFile.eTag = s3Response.ETag;

  await uploadedFile.save();

  res.send();
}

export async function listUploadedFilesRoute(req, res) {
  const uploadedFiles = await UploadedFile.find();
  res.json(uploadedFiles.map(file => file.toApi()));
}
