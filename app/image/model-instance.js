import mongoose from 'mongoose';

import tools from '../tools/modelTools.js';

const methods = {};

methods.getTagTitles = tools.getTagTitles;
methods.getTagValue = tools.getTagValue;
methods.hasTag = tools.hasTag;

methods.toSharedObject = function() {
  const exportFieldNames = ['_id', 'url', 'tags'];
  return tools.reduceToExportData(this, exportFieldNames);
}

methods.populateParent = async function() {
  this.source = await mongoose.model('Source').findOne({images: this})
    .populate('story');
  this.story = await mongoose.model('Story').findOne({images: this});
}

methods.src = function() {
  // Without the http, it tries to access GET for the current model.
  // In person view: <img src="bla"> = GET person/bla
  if (this.url.match('http')) {
    return this.url;
  }
  return 'http://' + this.url;
}

export default methods;
