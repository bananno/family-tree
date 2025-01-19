import _ from 'lodash';

import Story from './Story.model.js';
import Source from '../source/Source.model.js';

export default async function getStoryRoute(req, res) {
  const story = await Story.findById(req.params.id).populate([
    'people',
    'tags',
  ]);

  const entries = await Source.find({ story })
    .populate(['images', 'people'])
    .sort({ 'date.year': 1, 'date.month': 1, 'date.day': 1 });

  const nonEntrySources = await Source.find({ stories: story }).populate(
    'story'
  );

  nonEntrySources.forEach(source => source.populateFullTitle());

  const data = {
    ..._.pick(story, ['id', 'date', 'location', 'sharing', 'title', 'type']),
    content: story.content?.split('\n') || [],
    links: mapLinks(story.links),
    notes: splitNotes(story.notes),
    people: story.people.map(person => person.toListApi()),
    tags: story.convertTags({ asList: true }),
    entries: entries.map(mapEntry),
    nonEntrySources: nonEntrySources.map(source => ({
      id: source.id,
      fullTitle: source.fullTitle,
    })),
  };

  res.send({ data });
}

////////////////////

function mapLinks(links) {
  return links.map(link => {
    const arr = link.split(' ');
    return { url: arr.shift(), text: arr.join(' ') };
  });
}

function splitNotes(notes) {
  if (!notes) {
    return [];
  }
  return notes
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
}

function mapEntry(source) {
  return {
    ..._.pick(source, ['id', 'title', 'date', 'location', 'summary']),
    imageUrl: source.images[0]?.url,
  };
}
