import _ from 'lodash';

import Source from '../source/Source.model.js';

export default async function listStoriesNonEntrySourcesRoute(req, res) {
  // Each source has a "story" attribute representing the story that the source belongs to.
  // But it also has a "stories" attribute for the other stories that it's attached to.
  // Get the sources that have at least one item in the "stories" array.
  const sources = await Source.find({
    stories: { $exists: true, $not: { $size: 0 } },
  })
    .populate({ path: 'story', select: 'title' })
    .populate({ path: 'stories', select: 'title' })
    .select('title story stories');

  const stories = [];
  const storyMap = {};

  // Create an inverse of the source/stories relationship.
  // A list of stories, each with a list of the sources that don't belong to it
  // but are attached to it.
  sources.forEach(source => {
    const sourceItem = {
      id: source.id,
      fullTitle: `${source.story.title} - ${source.title}`,
    };
    source.stories.forEach(story => {
      if (storyMap[story.id]) {
        storyMap[story.id].sources.push(sourceItem);
      } else {
        const storyItem = {
          id: story.id,
          title: story.title,
          sources: [sourceItem],
        };
        storyMap[story.id] = storyItem;
        stories.push(storyItem);
      }
    });
  });

  res.send({ items: stories });
}
