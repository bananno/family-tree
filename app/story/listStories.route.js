import _ from 'lodash';

import Story from './Story.model.js';

export default async function listStoriesRoute(req, res) {
  const storyType = req.query.storyType;
  const filter = storyType ? { type: storyType } : {};

  const stories = await Story.find(filter);

  const types = await Story.distinct('type');

  const items = stories.map(story => ({
    ..._.pick(story, [
      'id',
      'title',
      'location',
      'date',
      'sharing',
      'type',
      'notes',
    ]),
  }));

  res.send({ items, types });
}
