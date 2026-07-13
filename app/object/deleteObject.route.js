import ObjectModel from './Object.model.js';

export default async function deleteObjectRoute(req, res) {
  const object = await ObjectModel.findById(req.params.id);

  if (!object) {
    return res.status(404).json({ error: 'Object not found' });
  }

  await ObjectModel.deleteOne({ _id: object.id });

  res.status(200).json({ message: 'Object deleted successfully' });
}
