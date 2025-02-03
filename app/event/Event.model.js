import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

const { constants, schema } = createModel({
  name: 'event',
  modelName: 'Event',
  modelSchema,
  instanceMethods,
  staticMethods,
});

for (let methodName in instanceMethods) {
  schema.methods[methodName] = instanceMethods[methodName];
}

for (let methodName in staticMethods) {
  schema.statics[methodName] = staticMethods[methodName];
}

schema.methods.constants = () => constants;
schema.statics.constants = () => constants;

schema.query.populatePeople = function () {
  return this.populate({
    path: 'people',
    populate: {
      path: 'avatar',
      select: 'file',
      populate: {
        path: 'file',
        select: 'key',
      },
    },
    select: 'name avatar',
  });
};

const Event = mongoose.model('Event', schema);

export default Event;
