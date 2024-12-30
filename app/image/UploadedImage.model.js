import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    eTag: String,
    filename: String,
  },
  { timestamps: true }
);

const UploadedImageModel = mongoose.model('UploadedImage', schema);

export default UploadedImageModel;
