import _ from 'lodash';

import ObjectModel from './Object.model.js';

export default async function listObjectsRoute(req, res) {
  const objects = await ObjectModel.find().sort('name');

  res.json({
    objects: objects.map(object =>
      _.pick(object, ['id', 'name', 'createdAt', 'updatedAt']),
    ),
  });
}
