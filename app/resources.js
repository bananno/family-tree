import citationModelSchema from './citation/model-schema.js';
import citationInstanceMethods from './citation/model-instance.js';
import citationStaticMethods from './citation/model-static.js';

import eventModelSchema from './event/model-schema.js';
import eventInstanceMethods from './event/model-instance.js';
import eventStaticMethods from './event/model-static.js';

import highlightModelSchema from './highlight/model-schema.js';
import highlightInstanceMethods from './highlight/model-instance.js';
import highlightStaticMethods from './highlight/model-static.js';

import imageModelSchema from './image/model-schema.js';
import imageInstanceMethods from './image/model-instance.js';
import imageStaticMethods from './image/model-static.js';

import locationModelSchema from './location/model-schema.js';
import locationInstanceMethods from './location/model-instance.js';
import locationStaticMethods from './location/model-static.js';

import notationModelSchema from './notation/model-schema.js';
import notationInstanceMethods from './notation/model-instance.js';
import notationStaticMethods from './notation/model-static.js';

import personModelSchema from './person/model-schema.js';
import personInstanceMethods from './person/model-instance.js';
import personStaticMethods from './person/model-static.js';

import sourceModelSchema from './source/model-schema.js';
import sourceInstanceMethods from './source/model-instance.js';
import sourceStaticMethods from './source/model-static.js';

import storyModelSchema from './story/model-schema.js';
import storyInstanceMethods from './story/model-instance.js';
import storyStaticMethods from './story/model-static.js';

import tagModelSchema from './tag/model-schema.js';
import tagInstanceMethods from './tag/model-instance.js';
import tagStaticMethods from './tag/model-static.js';

// This object is modified by reference in createModel.js
// and future imports of the file are affected
export default [
  {
    name: 'api',
    hasRoutes: true,
    hasModel: false,
  },
  {
    name: 'checklist',
    hasRoutes: true,
    hasModel: false,
  },
  {
    name: 'citation',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Citation',
    modelSchema: citationModelSchema,
    instanceMethods: citationInstanceMethods,
    staticMethods: citationStaticMethods,
  },
  {
    name: 'event',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Event',
    modelSchema: eventModelSchema,
    instanceMethods: eventInstanceMethods,
    staticMethods: eventStaticMethods,
  },
  {
    name: 'export',
    hasRoutes: true,
    hasModel: false,
  },
  {
    name: 'highlight',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Highlight',
    modelSchema: highlightModelSchema,
    instanceMethods: highlightInstanceMethods,
    staticMethods: highlightStaticMethods,
  },
  {
    name: 'image',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Image',
    modelSchema: imageModelSchema,
    instanceMethods: imageInstanceMethods,
    staticMethods: imageStaticMethods,
  },
  {
    name: 'location',
    hasRoutes: false,
    hasModel: true,
    modelName: 'Location',
    modelSchema: locationModelSchema,
    instanceMethods: locationInstanceMethods,
    staticMethods: locationStaticMethods,
  },
  {
    name: 'place',
    hasRoutes: true,
    hasModel: false,
  },
  {
    name: 'map',
    hasRoutes: true,
    hasModel: false,
  },
  {
    name: 'misc',
    hasRoutes: true,
    hasModel: false,
  },
  {
    name: 'notation',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Notation',
    modelSchema: notationModelSchema,
    instanceMethods: notationInstanceMethods,
    staticMethods: notationStaticMethods,
  },
  {
    name: 'person',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Person',
    modelSchema: personModelSchema,
    instanceMethods: personInstanceMethods,
    staticMethods: personStaticMethods,
  },
  {
    name: 'source',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Source',
    modelSchema: sourceModelSchema,
    instanceMethods: sourceInstanceMethods,
    staticMethods: sourceStaticMethods,
  },
  {
    name: 'story',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Story',
    modelSchema: storyModelSchema,
    instanceMethods: storyInstanceMethods,
    staticMethods: storyStaticMethods,
  },
  {
    name: 'tag',
    hasRoutes: true,
    hasModel: true,
    modelName: 'Tag',
    modelSchema: tagModelSchema,
    instanceMethods: tagInstanceMethods,
    staticMethods: tagStaticMethods,
  },
];
