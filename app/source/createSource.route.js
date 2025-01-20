import Source from './Source.model.js';

export default async function createSourceRoute(req, res) {
  const source = await Source.create({
    story: req.body.storyId,
    title: req.body.title,
  });

  res.json({ source: { id: source.id } });
}
