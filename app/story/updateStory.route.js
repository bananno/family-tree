import StoryModel from './Story.model.js';

export default async function updateStoryRoute(req, res) {
  const story = await StoryModel.findById(req.params.id);

  if (!story) {
    return res.status(404).send();
  }

  if ('summary' in req.body) {
    story.summary = req.body.summary?.trim();
  }

  if ('title' in req.body) {
    const title = req.body.title?.trim();
    if (!title) {
      return res.status(400).send({ error: 'title is required' });
    }
    story.title = title;
  }

  await story.save();

  res.send();
}
