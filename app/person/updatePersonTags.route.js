import Person from './Person.model.js';
import TagModel from '../tag/Tag.model.js';

export default async function updatePersonTagsRoute(req, res) {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  const action = req.body.action;
  const index = req.body.index;
  const tagId = req.body.tagId;
  const tagValue = req.body.tagValue?.trim() || '';

  const tag = tagId ? await TagModel.findById(tagId) : null;
  if (tagId && !tag) {
    return res.status(404).send('Tag not found');
  }

  if (!['add', 'delete', 'reorder', 'edit'].includes(action)) {
    return res.status(400).send('Invalid action');
  }

  if (action === 'add') {
    if (!tagId) {
      return res.status(400).send('Tag ID is required');
    }
    if (person.tags.map(tag => String(tag)).includes(tagId)) {
      return res.status(400).send('Tag already attached');
    }
    if (!tag.isModelAllowed('Person')) {
      return res.status(400).send('Tag does not support this model');
    }
  } else {
    if (person.tags[index] === undefined) {
      return res.status(400).send('Valid index is required');
    }
    if (action === 'reorder' && person.tags[index - 1] === undefined) {
      return res.status(400).send('Valid index is required');
    }
  }

  if (action === 'add' || action === 'edit') {
    if (tag.expectsValue()) {
      if (!tagValue) {
        return res.status(400).send('Tag value is required');
      }
      const options = tag.valueOptions();
      if (options && !options.includes(tagValue)) {
        return res.status(400).send('Tag value must be in the list');
      }
    } else if (tagValue) {
      return res.status(400).send('Tag value is not supported');
    }
  }

  if (action === 'add') {
    person.tags.push(tagId);
    person.tagValues.push(tagValue);
  } else if (action === 'edit') {
    person.tagValues[index] = tagValue;
  } else if (action === 'delete') {
    person.tags = [
      ...person.tags.slice(0, index),
      ...person.tags.slice(index + 1),
    ];
    person.tagValues = [
      ...person.tagValues.slice(0, index),
      ...person.tagValues.slice(index + 1),
    ];
  } else if (action === 'reorder') {
    const tempTag = person.tags[index];
    const tempTagValue = person.tagValues[index];

    person.tags[index] = person.tags[index - 1];
    person.tags[index - 1] = tempTag;

    person.tagValues[index] = person.tagValues[index - 1];
    person.tagValues[index - 1] = tempTagValue;
  }

  await person.save();

  res.send();
}
