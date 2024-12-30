import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    eTag: String,
    key: { type: String, required: true },
    fileType: { type: String, required: true }, // "image" or... other
  },
  { timestamps: true }
);

const UploadedFile = mongoose.model('UploadedFile', schema);

export default UploadedFile;
