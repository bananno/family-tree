import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

createModel({
  name: 'event',
  modelName: 'Event',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const Event = mongoose.model('Event');

export default Event;
