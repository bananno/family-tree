import mongoose from 'mongoose';

import { createController, getEditTableRows } from '../import.js';

import { indexFormats, modelsThatHaveTags } from './constants.js';
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
      delete: deleteTag,
      show: showTag,
      edit: editTag,
    },
  });
}

////////////////////

async function showTag(req, res) {
  const data = await tagTools.getTagShowData(req.tag);
  res.renderTag('show', {
    data,
    modelsThatHaveTags,
  });
}

async function editTag(req, res) {
  const canDelete = await req.tag.canBeDeleted();

  const tableRows = await getEditTableRows({
    item: req.tag,
    rootPath: req.rootPath,
  });

  res.renderTag('edit', {
    itemName: 'tag',
    canDelete,
    tableRows,
  });
}

async function deleteTag(req, res) {
  await Tag.deleteOne({_id: req.tagId});
  res.redirect('/tags');
}
