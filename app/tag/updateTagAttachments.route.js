import mongoose from 'mongoose';

import TagModel from './Tag.model.js';

export default async function updateTagAttachmentsRoute(req, res) {
  console.log('====== updateTagAttachmentsRoute ======');
  let subject;

  const subjectModel = req.body.modelName; // e.g., "Person"
  const subjectId = req.body.id;

  try {
    const Model = mongoose.model(subjectModel);
    subject = await Model.findById(subjectId).populate('tags');
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (!subject) {
    return res.status(404).send('Subject not found');
  }

  const action = req.body.action;
  const index = req.body.index;
  const tagId = req.body.tagId;
  const tagValue = req.body.tagValue?.trim() || '';

  // Validate action param.
  if (!['add', 'delete', 'reorder', 'edit'].includes(action)) {
    return res.status(400).send('Invalid action');
  }

  // Validate tagId or index param - one of these is required.
  if (action === 'add') {
    if (!tagId) {
      return res.status(400).send('Tag ID is required');
    }
  } else {
    if (subject.tags[index] === undefined) {
      return res.status(400).send('Valid index is required');
    }
    if (action === 'reorder' && subject.tags[index - 1] === undefined) {
      return res.status(400).send('Valid index is required');
    }
  }

  // Validate tag exists. If it doesn't exist, deleting the attachment is allowed.
  const tag =
    action === 'add' ? await TagModel.findById(tagId) : subject.tags[index];
  if (!tag && action !== 'delete') {
    return res.status(404).send('Tag not found');
  }

  // Validate that the tag may be attached.
  if (action === 'add') {
    if (subject.tags.map(tag => tag.id).includes(tagId)) {
      return res.status(400).send('Tag already attached');
    }
    if (!tag.isModelAllowed(subjectModel)) {
      return res.status(400).send('Tag does not support this model');
    }
  }

  // Validate tagValue param against the specific tag.
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
      return res.status(400).send('Tag value is not supported for this tag');
    }
  } else if (tagValue) {
    return res.status(400).send('Tag value is not supported for this action');
  }

  if (action === 'add') {
    subject.tags.push(tagId);
    subject.tagValues.push(tagValue);
  } else if (action === 'edit') {
    subject.tagValues[index] = tagValue;
  } else if (action === 'delete') {
    subject.tags = [
      ...subject.tags.slice(0, index),
      ...subject.tags.slice(index + 1),
    ];
    subject.tagValues = [
      ...subject.tagValues.slice(0, index),
      ...subject.tagValues.slice(index + 1),
    ];
  } else if (action === 'reorder') {
    const tempTag = subject.tags[index];
    const tempTagValue = subject.tagValues[index];

    subject.tags[index] = subject.tags[index - 1];
    subject.tags[index - 1] = tempTag;

    subject.tagValues[index] = subject.tagValues[index - 1];
    subject.tagValues[index - 1] = tempTagValue;
  }

  try {
    await subject.save();
    res.send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
