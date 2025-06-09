import Story from './Story.model.js';

export default async function createStoryRoute(req, res) {
  const story = await Story.create({
    type: req.body.type,
    title: req.body.title,
  });

  res.json({ story: { id: story.id } });
}
