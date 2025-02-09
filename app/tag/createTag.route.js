import _ from 'lodash';

import Tag from './Tag.model.js';

export default async function createTagRoute(req, res) {
  const title = req.body.title?.trim();

  if (!title || title.length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const existingTagCount = await Tag.countDocuments({
    title: { $regex: new RegExp(`^${title}$`, 'i') },
  });

  if (existingTagCount > 0) {
    return res.status(400).json({ error: 'Tag already exists' });
  }

  const tag = await Tag.create({ title });

  res.json({
    tag: _.pick(tag, ['_id', 'title']),
  });
}
