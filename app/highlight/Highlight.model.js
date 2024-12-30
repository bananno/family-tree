import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'highlight',
  modelName: 'Highlight',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Highlight = mongoose.model('Highlight');

export default Highlight;
