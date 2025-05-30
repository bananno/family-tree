import tools from '../tools/modelTools.js';

const methods = {};

methods.getTagTitles = tools.getTagTitles;
methods.getTagValue = tools.getTagValue;
methods.hasTag = tools.hasTag;
methods.convertTags = tools.convertTags2;

methods.getCategoryForStory = function() {
  if (this.title === 'source citation') {
    return 'citation';
  }
  if (this.title === 'excerpt' || this.hasTag('excerpt')) {
    return 'except';
  }
  return 'other';
};

export default methods;
