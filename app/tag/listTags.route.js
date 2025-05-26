import _ from 'lodash';
import mongoose from 'mongoose';

import TAGABLE_MODELS from './tagableModels.js';
import Tag from './Tag.model.js';

export default async function listTagsRoute(req, res) {
  // TODO: move the "allowedForModel" filter from the frontend to here.

  const tags = await Tag.find()
    .sort('title')
    .collation({ locale: 'en', strength: 2 });

  const usageCounts = await getTagUsageCounts();

  res.send({
    items: tags.map(tag => ({
      ..._.pick(tag, ['id', 'category', 'definition', 'title']),
      usageCount: usageCounts[tag.id] || 0,
      restrictedToModels: tag.getRestrictedModelList(),
    })),
  });
}

////////////////////

async function getTagUsageCounts() {
  const usageCount = {};

  const modelResults = await Promise.all(
    TAGABLE_MODELS.map(model =>
      mongoose
        .model(model.name)
        .find({ tags: { $ne: [] } })
        .select('tags'),
    ),
  );

  modelResults.forEach(records => {
    records.forEach(record => {
      record.tags.forEach(tag => {
        const tagId = String(tag);
        usageCount[tagId] = (usageCount[tagId] || 0) + 1;
      });
    });
  });

  return usageCount;
}
