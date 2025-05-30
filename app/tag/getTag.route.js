import _ from 'lodash';
import mongoose from 'mongoose';

import TAGABLE_MODELS from './tagableModels.js';
import Tag from './Tag.model.js';

export default async function getTagRoute(req, res) {
  const tagId = req.params.id;
  const isValidId = mongoose.Types.ObjectId.isValid(tagId);

  const tag = isValidId && (await Tag.findById(tagId).populate('tags'));

  if (!tag) {
    return res.status(404).json({ error: 'Tag not found' });
  }

  const data = {
    ..._.pick(tag, ['id', 'definition', 'category', 'title', 'valueType']),
    groupByValue: tag.hasTag('group by value'),
    restrictedToModels: tag.getRestrictedModelList(),
    showMissingItems: tag.hasTag('show missing items'),
    tags: tag.convertTags({ asList: true }),
    valueOptions: (tag.valueType === 2 && tag.values?.split('\n')) || [],
    valueTypeName: tag.getDropdownFieldValueName('valueType'),
  };

  data.attachedItems = await getAttachedItems(tag);

  // If every model list is empty, the tag can be deleted.
  data.canDelete = !Object.keys(data.attachedItems).some(
    model => data.attachedItems[model].length > 0,
  );

  if (data.showMissingItems) {
    data.missingItems = await getMissingItems(tag);
  }

  res.send({ data });
}

////////////////////

async function getAttachedItems(tag) {
  const results = await Promise.all(
    TAGABLE_MODELS.map(async model => {
      const { modelName, items } = await getAttachedItemsForModel(tag, model);
      return { modelName, items };
    }),
  );

  const attachedItems = {};

  results.forEach(({ modelName, items }) => {
    attachedItems[modelName] = items;
  });

  // console.log('attachedItems', attachedItems);

  return attachedItems;

  // TODO: what was happening here?
  await forEachModel(async Model => {
    const modelName = Model.modelName.toLowerCase();

    if (!tag.isModelAllowed(modelName)) {
      return;
    }

    let rawItems, rawMissingItems;

    if (modelName === 'source') {
      rawItems = await Model.find({ tags: tag._id }).populate('story');
      attachedItems[modelName] = rawItems.map(mapSourceItem);

      if (showMissingItems) {
        rawMissingItems = await Model.find({
          tags: { $nin: tag._id },
        }).populate('story');
        missingItems[modelName] = rawMissingItems.map(mapSourceItem);
      }
    } else {
      rawItems = await Model.find({ tags: tag._id });
      attachedItems[modelName] = rawItems.map(mapItem);

      if (showMissingItems) {
        rawMissingItems = await Model.find({ tags: { $nin: tag._id } });
        missingItems[modelName] = rawMissingItems.map(mapItem);
      }
    }

    if (tag.title === 'number of children') {
      attachedItems[modelName].forEach((person, i) => {
        person.numberOfChildrenInDatabase = rawItems[i].children.length;
      });
      missingItems[modelName].forEach((person, i) => {
        person.numberOfChildrenInDatabase = rawMissingItems[i].children.length;
      });
    }
  });

  return { attachedItems, missingItems };

  function mapSourceItem(item) {
    return {};
  }

  function mapItem(item) {
    return {
      id: item._id, // all models
      name: item.name, // people only
      tagValue: tag.valueType !== 0 ? item.getTagValue(tag) : undefined, // all models
      title: item.title, // everything except people & images
      // TO DO: add whatever's needed for images
    };
  }
}

async function getMissingItems(tag) {
  const results = await Promise.all(
    TAGABLE_MODELS.map(async model => {
      const { modelName, items } = await getAttachedItemsForModel(tag, model);
      return { modelName, items };
    }),
  );

  const missingItems = {};

  results.forEach(({ name, data }) => {
    missingItems[name] = data;
  });

  return missingItems;
}

async function getAttachedItemsForModel(tag, modelDetails) {
  const model = mongoose.model(modelDetails.name);
  const modelName = model.modelName.toLowerCase();

  let query = model.find({ tags: tag._id }).select('title tags tagValues');

  // Handle variations in models + special cases for tags.
  if (modelName === 'source') {
    query = query.populateStoryTitle().select('story');
  } else if (modelName === 'person') {
    query = query.populateAvatar().select('name avatar gender');
    if (tag.title === 'number of children') {
      query = query.select('children');
    }
  }

  const items = await query;

  // Handle variations in models + special cases for tags.
  if (modelName === 'source') {
    items.forEach(item => {
      item.fullTitle = item.populateFullTitle();
    });
  } else if (modelName === 'person') {
    if (tag.title === 'number of children') {
      items.forEach(item => {
        item.numberOfChildrenInDatabase = item.children.length;
      });
    }
  }

  const mappedItems = items.map(item => ({
    ..._.pick(item, ['id', 'title', 'fullTitle', 'numberOfChildrenInDatabase']),
    ...(item.toListApi?.() || {}),
    tagValue: tag.valueType !== 0 ? item.getTagValue(tag) : undefined,
    // TO DO: add whatever's needed for images
  }));

  return {
    modelName,
    items: mappedItems,
  }
}

async function forEachModel(callback) {
  for (let i in TAGABLE_MODELS) {
    const modelName = TAGABLE_MODELS[i].name;
    const Model = mongoose.model(modelName);
    const pluralName = TAGABLE_MODELS[i].plural;
    await callback(Model, modelName, pluralName);
  }
}
