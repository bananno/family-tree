import mongoose from 'mongoose';

import { Tag } from '../import.js';

import TAGABLE_MODELS from './tagableModels.js';
import getTagDataFindagraveWikitree from './tools-findagrave-wikitree.js';

const tools = {};

tools.convertParamTagId = async (req, res, next, paramTagId) => {
  if (req.originalUrl.slice(0, 5) !== '/tag/') {
    return next();
  }

  const tag = await Tag.findByIdOrTitle(paramTagId);

  if (!tag) {
    return res.send('tag not found');
  }

  req.paramTagId = paramTagId;
  req.tagId = tag._id;
  req.tag = tag;
  req.rootPath = `/tag/${req.tagId}`;
  next();
}

tools.createRenderTag = function(req, res, next) {
  res.renderTag = async (subview, options = {}) => {
    res.render('tag/_layout', {
      subview,
      tag: req.tag,
      title: 'Tag: ' + req.tag.title,
      rootPath: req.roothPath || '/tag/' + req.tag._id,
      ...options
    });
  };
  next();
};

async function forEachModel(callback) {
  for (let i in TAGABLE_MODELS) {
    const modelName = TAGABLE_MODELS[i].name;
    const Model = mongoose.model(modelName);
    const pluralName = TAGABLE_MODELS[i].plural;
    await callback(Model, modelName, pluralName);
  }
}

tools.getTagShowData = async function(tag) {
  if (tag.title === 'findagrave') {
    return getTagDataFindagraveWikitree({tag, isFindAGrave: true});
  } else if (tag.title === 'wikitree') {
    return getTagDataFindagraveWikitree({tag, isWikitree: true});
  }

  const data = {};

  const metatagTitles = tag.getTagTitles();

  if (metatagTitles.includes('group by value')) {
    data.groupByValue = {};
    data.values = {};
  }
  if (metatagTitles.includes('show missing items')) {
    data.missingItems = {};
  }

  await forEachModel(async (Model, modelName, pluralName) => {
    if (!tag.isModelAllowed(modelName)) {
      data[pluralName] = [];
      if (data.groupByValue) {
        data.values[pluralName] = [];
      }
      if (data.missingItems) {
        data.missingItems[pluralName] = [];
      }
      return;
    }

    if (pluralName === 'sources') {
      data[pluralName] = await Model.find({tags: tag._id}).populate('story');
    } else {
      data[pluralName] = await Model.find({tags: tag._id});
    }

    if (data.groupByValue) {
      const byValue = {};

      data[pluralName].forEach(item => {
        const tagValue = item.getTagValue(tag);
        byValue[tagValue] = byValue[tagValue] || [];
        byValue[tagValue].push(item);
      });

      data.groupByValue[pluralName] = byValue;
      data.values[pluralName] = Object.keys(byValue);
    }

    if (data.missingItems) {
      if (pluralName === 'sources') {
        data.missingItems[pluralName] = await Model
          .find({tags: {$nin: tag._id}})
          .populate('story');
      } else {
        data.missingItems[pluralName] = await Model
          .find({tags: {$nin: tag._id}});
      }
    }
  });

  return data;
};

export default tools;
