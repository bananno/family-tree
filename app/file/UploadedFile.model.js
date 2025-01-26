import _ from 'lodash';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { uploadFileToS3 } from '../tools/s3.js';

dotenv.config();

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

schema.statics.newFromFile = (file, options = {}) => {
  const uploadedFile = new UploadedFile({
    fileType: 'image',
    mimeType: file.mimetype,
    size: file.size,
  });

  if (options.generateKey) {
    // Note that the key won't actually match the final id because the id may change on save.
    const extension = file.originalname.split('.').pop();
    uploadedFile.key = `${uploadedFile.id}.${extension}`;
  } else if (options.key) {
    uploadedFile.key = options.key;
  } else {
    uploadedFile.key = file.originalname;
  }

  if (options.directory) {
    uploadedFile.key = [options.directory, uploadedFile.key].join('/');
  }

  return uploadedFile;
};

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
  const s3Response = await uploadFileToS3({
    Key: this.key,
    Body: file.buffer,
    ContentType: this.mimeType,
  });

  this.eTag = s3Response.ETag;

  await this.save();
};

const UploadedFile = mongoose.model('UploadedFile', schema);

export default UploadedFile;
