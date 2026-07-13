import ObjectModel from './Object.model.js';

export default async function updateObjectRoute(req, res) {
  const object = await ObjectModel.findById(req.params.id);

  if (!object) {
    return res.status(404).json({ error: 'Object not found' });
  }

  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  object.name = name;

  await object.save();

  res.status(200).send();
}
