import _ from 'lodash';

import Source from '../source/Source.model.js';
import Story from './Story.model.js';

export default async function listStoriesRoute(req, res) {
  const storyType = req.query.storyType;
  const filter = storyType ? { type: storyType } : {};

  const stories = await Story.find(filter);

  const types = await Story.distinct('type');

  const sourceCountsMap = await getNumberOfSourcesPerStoryId();

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
    filterText: [story.title, story.notes].filter(Boolean).join(' '),
    sourceCount: sourceCountsMap[story.id] || 0,
  }));

  res.send({ items, types });
}

////////////////////

async function getNumberOfSourcesPerStoryId() {
  const sourceCounts = await Source.aggregate([
    {
      $group: {
        _id: '$story',
        count: { $sum: 1 },
      },
    },
  ]);

  const sourceCountsMap = {};

  sourceCounts.forEach(({ _id, count }) => {
    sourceCountsMap[String(_id)] = count;
  });

  return sourceCountsMap;
}
