import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'story',
  modelName: 'Story',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Story = mongoose.model('Story');

export default Story;
