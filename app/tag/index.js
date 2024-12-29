import { Tag, createController, getEditTableRows } from '../import.js';
import createModel from '../tools/createModel.js';
import resources from '../resources.js';

import { indexFormats, modelsThatHaveTags } from './constants.js';
import tagTools from './tools.js';

export default function createRoutes(router) {
  router.use(tagTools.createRenderTag);
  router.param('id', tagTools.convertParamTagId);

  const resource = resources.find(resource => resource.name === 'tag');
  const Tag = createModel(resource);

  createController({
    Model: Tag,
    modelName: 'tag',
    modelNamePlural: 'tags',
    router,
    routes: {
      index: tagIndex,
      create: createTag,
      delete: deleteTag,
      show: showTag,
      edit: editTag,
    },
  });

  router.get('/tags/:indexFormat', tagIndex);
}

////////////////////

async function tagIndex(req, res) {
  const indexFormat = req.params.indexFormat || indexFormats[0];

  const tags = await Tag.find({});
  Tag.sortByTitle(tags);

  await Tag.populateUsageCount(tags);

  const pageData = {
    title: 'Tags',
    indexFormat,
    totalNumTags: tags.length,
    tags,
    modelsThatHaveTags,
    indexFormats,
  };

  if (indexFormat === 'definition') {
    pageData.tagsDefined = tags.filter(tag => tag.definition);
    pageData.tagsUndefined = tags.filter(tag => !tag.definition);
  } else if (indexFormat === 'categories') {
    const categoryTags = {};
    const noCategory = [];

    tags.forEach(tag => {
      if (tag.category) {
        tag.category
          .split(',')
          .map(str => str.trim())
          .forEach(category => {
            categoryTags[category] = categoryTags[category] || [];
            categoryTags[category].push(tag);
          });
      } else {
        noCategory.push(tag);
      }
    });

    pageData.categoryList = [...Object.keys(categoryTags).sort(), 'none'];
    categoryTags.none = noCategory;
    pageData.categoryTags = categoryTags;
  }

  res.render('tag/index', pageData);
}

async function createTag(req, res) {
  const newTag = Tag.getFormDataNew(req);

  if (!newTag) {
    return res.send('error');
  }

  const tag = await Tag.create(newTag);
  res.redirect(`/tag/${tag._id}/edit`);
}

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
