import _ from 'lodash';
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UploadedFile',
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

schema.methods.toApi = function () {
  return {
    ..._.pick(this, ['id', 'selected', 'createdAt', 'updatedAt']),
    filename: this.file?.key,
    url: this.file?.url(),
  };
};

const PersonAvatar = mongoose.model('PersonAvatar', schema);

export default PersonAvatar;
