import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

const ObjectModel = mongoose.model('Object', schema);

export default ObjectModel;
