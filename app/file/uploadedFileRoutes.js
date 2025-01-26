import _ from 'lodash';
import mongoose from 'mongoose';
import multer from 'multer';

const UploadedFile = mongoose.model('UploadedFile');

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadFileMiddleware = upload.single('file');

export async function createUploadedFileRoute(req, res) {
  const file = req.file;

  const uploadedFile = UploadedFile.newFromFile(file, {
    key: req.body.filename,
  });

  await uploadedFile.save();
  await uploadedFile.executeUpload(file);

  res.send();
}

export async function listUploadedFilesRoute(req, res) {
  const uploadedFiles = await UploadedFile.find().sort({ createdAt: -1 });
  res.json(uploadedFiles.map(file => file.toApi()));
}
