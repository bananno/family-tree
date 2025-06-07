import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

export const PERSON_GENDER = {
  NOT_SPECIFIED: 0,
  FEMALE: 1,
  MALE: 2,
  UNKNOWN: 3,
};

const PERSON_SHARE_LEVEL = {
  NONE: 0,
  RESTRICTED: 1,
  EVERYTHING: 2,
};

const { constants, preMongooseSchema } = createModel({
  modelName: 'Person',
  modelSchema,
});

const schema = new mongoose.Schema(
  {
    ...preMongooseSchema,
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PersonAvatar',
    },
    customId: String,
    gender: {
      type: Number,
      default: PERSON_GENDER.NOT_SPECIFIED,
      enum: Object.values(PERSON_GENDER),
      required: true,
    },
    links: [String],
    living: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    shareLevel: {
      type: Number,
      default: PERSON_SHARE_LEVEL.NONE,
      enum: Object.values(PERSON_SHARE_LEVEL),
      required: true,
    },
    shareName: String,
  },
  { timestamps: true },
);

for (let methodName in instanceMethods) {
  schema.methods[methodName] = instanceMethods[methodName];
}

for (let methodName in staticMethods) {
  schema.statics[methodName] = staticMethods[methodName];
}

schema.query.populateAvatar = function () {
  return this.populate({
    path: 'avatar',
    select: 'file',
    populate: {
      path: 'file',
      select: 'key',
    },
  });
};

schema.methods.avatarUrl = function () {
  return this.avatar?.url?.() || this.profileImage;
};

schema.methods.constants = () => constants;
schema.statics.constants = () => constants;

const Person = mongoose.model('Person', schema);

export default Person;
