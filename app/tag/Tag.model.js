import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

export const TAG_VALUE_TYPE = {
  NONE: 0,
  TEXT: 1,
  OPTIONS: 2,
};

const { constants, schema } = createModel({
  name: 'tag',
  modelName: 'Tag',
  modelSchema,
  instanceMethods,
  staticMethods,
});

for (let methodName in instanceMethods) {
  schema.methods[methodName] = instanceMethods[methodName];
}

for (let methodName in staticMethods) {
  schema.statics[methodName] = staticMethods[methodName];
}

schema.methods.constants = () => constants;
schema.statics.constants = () => constants;

schema.methods.expectsValue = function () {
  return this.valueType !== TAG_VALUE_TYPE.NONE;
};

schema.methods.valueOptions = function () {
  return this.valueType === TAG_VALUE_TYPE.OPTIONS
    ? this.values.split('\n').map(s => s.trim())
    : null;
};

const Tag = mongoose.model('Tag', schema);

export default Tag;
