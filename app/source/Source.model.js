import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'source',
  hasRoutes: true,
  hasModel: true,
  modelName: 'Source',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Source = mongoose.model('Source');

export default Source;
