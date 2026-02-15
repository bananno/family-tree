import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

const { constants, legacySchemaToConvert } = createModel({
  name: 'notation',
  modelName: 'Notation',
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

schema.statics.findBySafeId = function (id) {
  return mongoose.Types.ObjectId.isValid(id)
    ? this.findById(id)
    : this.findById(null); // chainable
};

const Notation = mongoose.model('Notation', schema);

export default Notation;
