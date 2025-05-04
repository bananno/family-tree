import Tag from './Tag.model.js';

export default async function updateTagRoute(req, res) {
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    return res.status(404).json({ error: 'Tag not found' });
  }

  tag.title = req.body.title.trim();

  // Clean up irregular line breaks and leading/trailing spaces,
  // but allow empty lines.
  tag.definition = req.body.definition
    .split('\n')
    .map(s => s.trim())
    .join('\n');

  tag.category = req.body.category.trim();
  tag.valueType = Number(req.body.valueType);

  tag.values =
    tag.valueType === 2
      ? req.body.valueOptions
          .map(s => s.trim())
          .filter(Boolean)
          .join('\n')
      : null;

  try {
    await tag.save();
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  res.send();
}
