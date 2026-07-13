import _ from 'lodash';
import mongoose from 'mongoose';

import ObjectModel from './Object.model.js';

export default async function getObjectRoute(req, res) {
  const objectId = req.params.id;
  const isValidId = mongoose.Types.ObjectId.isValid(objectId);

  const object = isValidId && (await ObjectModel.findById(objectId));

  if (!object) {
    return res.status(404).json({ error: 'Object not found' });
  }

  res.json({
    object: _.pick(object, ['id', 'name', 'createdAt', 'updatedAt']),
  });
}
