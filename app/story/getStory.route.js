import _ from 'lodash';

import Story from './Story.model.js';
import Source from '../source/Source.model.js';

const populateAvatarUrl = {
  path: 'avatar',
  select: 'file',
  populate: { path: 'file', select: 'key' },
};

export default async function getStoryRoute(req, res) {
  const admin = req.session?.user?.admin;

  const story = await Story.findById(req.params.id)
    .populate({ path: 'people', populate: populateAvatarUrl })
    .populate('tags');

  if (!story) {
    return res.status(404).send({ message: 'Story not found' });
  }

  if (!admin && !story.sharing) {
    return res.status(403).send({ message: 'Forbidden' });
  }

  const entrySourceQuery = { story };
  const nonEntrySourceQuery = { stories: story };

  // Even if the story is shared, individual entries might not be shared.
  if (!admin) {
    entrySourceQuery.sharing = true;
    nonEntrySourceQuery.sharing = true;
  }

  const entries = await Source.find(entrySourceQuery)
    .populate(['images', 'tags'])
    .populate({ path: 'people', populate: populateAvatarUrl })
    .sort({ 'date.year': 1, 'date.month': 1, 'date.day': 1, title: 1 });

  // Non-entry sources belong to a different story, but they are linked
  // to this story.
  const allNonEntrySources =
    await Source.find(nonEntrySourceQuery).populate('story');

  // Non-entry sources were already filtered to shared only, but must also make sure
  // sources that might belong to non-shared stories are filtered out.
  const nonEntrySources = admin
    ? allNonEntrySources
    : allNonEntrySources.filter(source => source.story.sharing);

  nonEntrySources.forEach(source => source.populateFullTitle());

  const data = {
    ..._.pick(story, [
      'id',
      'date',
      'kind',
      'location',
      'sharing',
      'title',
      'type',
    ]),
    content: story.content?.split('\n') || [],
    links: mapLinks(story.links),
    notes: splitNotes(story.notes),
    people: mapPeople(story.people, admin),
    tags: story.convertTags({ asList: true }),
    entries: entries.map(source => ({
      ..._.pick(source, [
        'id',
        'date',
        'location',
        'sharing',
        'summary',
        'title',
        'useMarkdown',
      ]),
      content: source.content?.split('\n') || [],
      imageUrl: source.images[0]?.url,
      images: source.images.map(image => _.pick(image, ['id', 'url'])),
      notes: splitNotes(source.notes),
      people: mapPeople(source.people, admin),
      tags: source.convertTags({ asList: true }),
    })),
    nonEntrySources: nonEntrySources.map(source => ({
      id: source.id,
      fullTitle: source.fullTitle,
    })),
  };

  res.send(data);
}

////////////////////

function mapLinks(links) {
  return links.map(link => {
    const arr = link.split(' ');
    return { url: arr.shift(), text: arr.join(' ') };
  });
}

// For the story and each of its entries, map the people based on access level and then
// remove any that are not allowed to be seen.
function mapPeople(people, admin) {
  return people
    .map(person => person.toListApi({ restrict: !admin }))
    .filter(Boolean);
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
