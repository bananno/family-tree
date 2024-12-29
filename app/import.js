import resources from './resources.js';
import modelTools from './tools/modelTools.js';

import createController from './tools/createController.js';
import dateStructure from './tools/dateStructure.js';
import getEditTableRows from './tools/getEditTableRows.js';
import locationTools from './tools/locationTools.js';
import removeDuplicatesFromList from './tools/removeDuplicatesFromList.js';
import reorderList from './tools/reorderList.js';
import sorting from './tools/sorting.js';

export {
  createController,
  dateStructure,
  getEditTableRows,
  locationTools,
  removeDuplicatesFromList,
  reorderList,
  sorting,
};

const importables = {
  models: [],
  modelRef: {},
  ...modelTools,
};

resources
  .filter(resource => resource.hasModel)
  .forEach(({ Model, modelName }) => {
    importables[modelName] = Model;
    importables.models.push(Model);
    importables.modelRef[modelName] = Model;
  });

export const Citation = importables.Citation;
export const Event = importables.Event;
export const Highlight = importables.Highlight;
export const Image = importables.Image;
export const Notation = importables.Notation;
export const Person = importables.Person;
export const Source = importables.Source;
export const Story = importables.Story;
export const Tag = importables.Tag;

export const models = importables.models;
export const modelRef = importables.modelRef;
export const sortBy = importables.sortBy;
