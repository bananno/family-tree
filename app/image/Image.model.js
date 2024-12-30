import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'image',
  modelName: 'Image',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Image = mongoose.model('Image');

export default Image;
