import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'tag',
  modelName: 'Tag',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Tag = mongoose.model('Tag');

export default Tag;
