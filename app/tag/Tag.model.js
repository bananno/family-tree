import mongoose from 'mongoose';

import validateTagAndValues from './validateTagAndValues.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

export const TAG_VALUE_TYPE = {
  NONE: 0,
  TEXT: 1,
  OPTIONS: 2,
};

const schema = new mongoose.Schema(
  {
    allowEvent: Boolean,
    allowImage: Boolean,
    allowNotation: Boolean,
    allowPerson: Boolean,
    allowSource: Boolean,
    allowStory: Boolean,
    allowTag: Boolean,
    category: String,
    definition: String,
    restrictModels: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        ref: 'Tag',
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    tagValues: [String],
    title: {
      type: String,
      required: true,
    },
    values: String,
    valueType: {
      type: Number,
      default: TAG_VALUE_TYPE.NONE,
      enum: Object.values(TAG_VALUE_TYPE),
      required: true,
    },
  },
  { timestamps: true },
);

schema.pre('validate', validateTagAndValues);

for (let methodName in instanceMethods) {
  schema.methods[methodName] = instanceMethods[methodName];
}

for (let methodName in staticMethods) {
  schema.statics[methodName] = staticMethods[methodName];
}

schema.methods.expectsValue = function () {
  return this.valueType !== TAG_VALUE_TYPE.NONE;
};

// Model is singular and capitalized, e.g. "Person"
schema.methods.isModelAllowed = function (modelName) {
  return !this.restrictModels || this['allow' + modelName];
};

schema.methods.valueOptions = function () {
  return this.valueType === TAG_VALUE_TYPE.OPTIONS
    ? this.values.split('\n').map(s => s.trim())
    : null;
};

schema.methods.valueTypeDescription = function () {
  return {
    [TAG_VALUE_TYPE.NONE]: 'None',
    [TAG_VALUE_TYPE.TEXT]: 'Text',
    [TAG_VALUE_TYPE.OPTIONS]: 'List of options',
  }[this.valueType];
};

const Tag = mongoose.model('Tag', schema);

export default Tag;
