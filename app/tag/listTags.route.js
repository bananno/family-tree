import _ from 'lodash';

import MODELS_WITH_TAGS from './modelsWithTags.js';
import Tag from './Tag.model.js';

export default async function listTagsRoute(req, res) {
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
    MODELS_WITH_TAGS.map(model =>
      model.find({ tags: { $ne: [] } }).select('tags'),
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
