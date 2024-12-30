import mongoose from 'mongoose';

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

export const getDateSortStr = sorting.getDateSortStr;
export const padZero = sorting.padZero;
export const sortBy = sorting.sortBy;
export const sortByDate = sorting.sortByDate;
export const sortByTitle = sorting.sortByTitle;

export const Citation = mongoose.model('Citation');
export const Event = mongoose.model('Event');
export const Highlight = mongoose.model('Highlight');
export const Image = mongoose.model('Image');
export const Notation = mongoose.model('Notation');
export const Person = mongoose.model('Person');
export const Source = mongoose.model('Source');
export const Story = mongoose.model('Story');
export const Tag = mongoose.model('Tag');
