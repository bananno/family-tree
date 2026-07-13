import _ from 'lodash';

import ObjectModel from './Object.model.js';

export default async function createObjectRoute(req, res) {
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const object = await ObjectModel.create({ name });

  res.status(201).json({
    object: _.pick(object, ['id', 'name', 'createdAt', 'updatedAt']),
  });
}
