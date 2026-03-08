import express from 'express';

import listUploadedFilesRoute from './listUploadedFiles.route.js';
import UploadedFileModel from './UploadedFile.model.js';
import uploadFileMiddleware from './uploadFileMiddleware.js';

// All routes are protected.
const router = express.Router();

router.get('/', listUploadedFilesRoute);
router.post('/', uploadFileMiddleware, createUploadedFileRoute);

export default router;

////////////////////

async function createUploadedFileRoute(req, res) {
  const file = req.file;

  const uploadedFile = UploadedFileModel.newFromFile(file, {
    key: req.body.filename,
  });

  await uploadedFile.save();
  await uploadedFile.executeUpload(file);

  res.send();
}
