import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

const { constants, schema } = createModel({
  name: 'source',
  hasRoutes: true,
  hasModel: true,
  modelName: 'Source',
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

schema.query.populateStoryTitle = function () {
  return this.populate({ path: 'story', select: 'title' });
};

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
  });
};

schema.methods.constants = () => constants;
schema.statics.constants = () => constants;

const Source = mongoose.model('Source', schema);

export default Source;
