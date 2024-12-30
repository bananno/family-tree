import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'person',
  modelName: 'Person',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Person = mongoose.model('Person');

export default Person;
