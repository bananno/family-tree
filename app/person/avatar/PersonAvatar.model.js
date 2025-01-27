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
  },
  { timestamps: true },
);

schema.methods.toApi = function (selectedId) {
  return {
    ..._.pick(this, ['id', 'createdAt', 'updatedAt']),
    selected: this.id === selectedId,
    filename: this.file?.key,
    url: this.url(),
  };
};

schema.methods.url = function () {
  return this.file?.url();
};

const PersonAvatar = mongoose.model('PersonAvatar', schema);

export default PersonAvatar;
