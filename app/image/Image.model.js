import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

const { constants, legacySchemaToConvert } = createModel({
  name: 'image',
  modelName: 'Image',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const schema = new mongoose.Schema(
  {
    ...legacySchemaToConvert,
  },
  { timestamps: true },
);

for (let methodName in instanceMethods) {
  schema.methods[methodName] = instanceMethods[methodName];
}

for (let methodName in staticMethods) {
  schema.statics[methodName] = staticMethods[methodName];
}

schema.methods.constants = () => constants;
schema.statics.constants = () => constants;

const Image = mongoose.model('Image', schema);

export default Image;
