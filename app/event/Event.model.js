import _ from 'lodash';
import mongoose from 'mongoose';

import createModel from '../tools/createModel.js';

import modelSchema from './model-schema.js';
import instanceMethods from './model-instance.js';
import staticMethods from './model-static.js';

const { constants, legacySchemaToConvert } = createModel({
  name: 'event',
  modelName: 'Event',
  modelSchema,
  instanceMethods,
  staticMethods,
});

const schema = new mongoose.Schema(
  {
    ...legacySchemaToConvert,
  },
  { timestamps: true },
);

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
    select: 'name avatar gender',
  });
};

schema.methods.getMappedTags = function () {
  return this.tags.map((tag, i) => ({
    id: tag.id,
    title: tag.title,
    value: this.tagValues[i],
  }));
};

// Returns the details needed to display or edit the event in a non-event-centric view.
// Options: { restrict: boolean } - if true, only include info that should be visible to non-admins.
// Events don't have their own share level.
schema.methods.toApi = function (options = {}) {
  const restrict = options.restrict || false;

  return {
    ..._.pick(this, ['id', 'title', 'date', 'location', 'notes']),
    people: this.people
      .map(person => person.toListApi({ restrict }))
      .filter(Boolean),
  };
};

const Event = mongoose.model('Event', schema);

export default Event;
