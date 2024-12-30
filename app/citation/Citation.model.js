import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'citation',
  modelName: 'Citation',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Citation = mongoose.model('Citation');

export default Citation;
