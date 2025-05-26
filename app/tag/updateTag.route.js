import Tag from './Tag.model.js';

export default async function updateTagRoute(req, res) {
  try {
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

    tag.tags = req.body.tags;

    tag.restrictModels = req.body.restrictModels;

    tag.allowEvent = req.body.restrictedToModels.includes('events');
    tag.allowImage = req.body.restrictedToModels.includes('images');
    tag.allowNotation = req.body.restrictedToModels.includes('notations');
    tag.allowPerson = req.body.restrictedToModels.includes('people');
    tag.allowSource = req.body.restrictedToModels.includes('sources');
    tag.allowStory = req.body.restrictedToModels.includes('stories');
    tag.allowTag = req.body.restrictedToModels.includes('tags');

    await tag.save();

    res.send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
