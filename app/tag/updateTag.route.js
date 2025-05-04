import Tag from './Tag.model.js';

export default async function updateTagRoute(req, res) {
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    return res.status(404).json({ error: 'Tag not found' });
  }

  tag.title = req.body.title;

  await tag.save();

  res.send();
}
