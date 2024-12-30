import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'notation',
  modelName: 'Notation',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Notation = mongoose.model('Notation');

export default Notation;
