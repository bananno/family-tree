import Tag from './Tag.model.js';

export default async function deleteTagRoute(req, res) {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const canDelete = await tag.canBeDeleted();

    if (!canDelete) {
      return res.status(400).json({
        error: 'Tag cannot be deleted because it is attached to items',
      });
    }

    await Tag.deleteOne({ _id: tag.id });

    console.log('Tag deleted', tag);
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
