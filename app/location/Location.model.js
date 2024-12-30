import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'location',
  modelName: 'Location',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Location = mongoose.model('Location');

export default Location;
