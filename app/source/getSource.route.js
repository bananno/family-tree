import _ from 'lodash';

import SourceModel from './Source.model.js';
import CitationModel from '../citation/Citation.model.js';

const populateAvatarUrl = {
  path: 'avatar',
  select: 'file',
  populate: { path: 'file', select: 'key' },
};

export default async function getSource(req, res) {
  const admin = req.session?.user?.admin;

  const source = await SourceModel.findById(req.params.id)
    .populate('story')
    .populate('tags')
    .populatePeople();

  if (!source) {
    return res.status(404).send('Source not found');
  }

  if (!admin && (!source.sharing || !source.story.sharing)) {
    return res.status(403).send('Forbidden');
  }

  const citations = await getCitations(source, admin);

  const splitContent = source.content?.split('\n') || [];

  const data = {
    id: source._id,
    citations,
    content: splitContent,
    originalContent: source.content,
    date: source.date,
    links: mapLinks(source.links),
    location: source.location,
    notes: splitNotes(source.notes),
    people: source.people.map(person => person.toListApi({ restrict: !admin })),
    sharing: source.sharing,
    tags: source.convertTags({ asList: true }),
    title: source.title,
    useMarkdown: source.useMarkdown,
    story: {
      id: source.story._id,
      title: source.story.title,
      type: source.story.type,
    },
  };

  res.json(data);
}

////////////////////

// Get the citations for the source.
// If not admin, only get citations for people that are public (fully shared).
// Sort the citations by person, then by item.
async function getCitations(source, admin) {
  if (source.people.length === 0) {
    return [];
  }

  const filter = { source: source._id };

  if (!admin) {
    const publicPersonIds = source.people
      .filter(person => person.isPublic())
      .map(person => person.id);

    if (publicPersonIds.length === 0) {
      return [];
    }

    if (publicPersonIds.length < source.people.length) {
      filter.person = { $in: publicPersonIds };
    }
  }

  // TODO: add a populatePerson method on the Citation model
  // similar to source.populatePeople().
  const citations = await CitationModel.find(filter).populate({
    path: 'person',
    populate: populateAvatarUrl,
  });

  const mappedCitations = citations.map(citation => ({
    ..._.pick(citation, ['id', 'information']),
    ...citation.splitItem(),
    // person not restricted because non-public is already filtered out
    person: citation.person.toListApi(),
  }));

  // Sort by
  // 1. the person's position in the source's people list
  // 2. itemPart1 (e.g. "birth")
  // 3. itemPart2 (e.g. "date")
  // TODO: sort item parts by specified order instead of alphabetically.
  return _.sortBy(mappedCitations, citation => {
    const personId = citation.person?.id;
    const index = source.people.findIndex(person => person.id === personId);
    return [index, citation.itemPart1, citation.itemPart2];
  });
}

// TODO: revisit old stuff here

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
