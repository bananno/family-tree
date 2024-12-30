import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    eTag: String,
    key: String,
    fileType: String, // "image" or... other
  },
  { timestamps: true }
);

const UploadedFile = mongoose.model('UploadedFile', schema);

export default UploadedFile;
