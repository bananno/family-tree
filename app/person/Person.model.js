import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

export const PERSON_GENDER = {
  FEMALE: 1,
  MALE: 2,
  UNKNOWN: 3,
};

const { constants, schema } = createModel({
  name: 'person',
  modelName: 'Person',
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

const Person = mongoose.model('Person', schema);

export default Person;
