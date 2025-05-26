import mongoose from 'mongoose';

import { createController } from '../import.js';

import TAGABLE_MODELS from './tagableModels.js';
import tagTools from './tools.js';

const Tag = mongoose.model('Tag');

export default function createRoutes(router) {
  router.use(tagTools.createRenderTag);
  router.param('id', tagTools.convertParamTagId);

  createController({
    Model: Tag,
    modelName: 'tag',
    modelNamePlural: 'tags',
    router,
    routes: {
      show: showTag,
    },
  });
}

////////////////////

async function showTag(req, res) {
  const data = await tagTools.getTagShowData(req.tag);
  res.renderTag('show', {
    data,
    modelsThatHaveTags: TAGABLE_MODELS,
  });
}
