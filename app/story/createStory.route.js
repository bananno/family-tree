import _ from 'lodash';

import Story from './Story.model.js';

export default async function createStoryRoute(req, res) {
  const story = await Story.create({
    type: req.body.type,
    title: req.body.title,
    date: _.pick(req.body.date, ['year', 'month', 'day', 'display']),
    location: _.pick(req.body.location, [
      'country',
      'region1',
      'region2',
      'city',
      'notes',
    ]),
  });

  res.json({ story: { id: story.id } });
}
