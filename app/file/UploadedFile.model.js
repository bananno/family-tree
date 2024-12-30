import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

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
      required: true
    },
  },
  { timestamps: true }
);

schema.methods.toApi = function () {
  return {
    id: this.id,
    filename: this.key,
    url: `${process.env.IMAGE_HOSTING_PATH}/${this.key}`,
  };
};

const UploadedFile = mongoose.model('UploadedFile', schema);

export default UploadedFile;
