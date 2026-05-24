import SourceModel from './Source.model.js';

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

  await source.populateAndSortCitations();

  const splitContent = source.content?.split('\n') || [];

  const data = {
    id: source._id,
    citations: mapCitationsIncludePerson(source.citationsByPerson),
    content: splitContent,
    originalContent: source.content,
    date: source.date,
    links: mapLinks(source.links),
    location: source.location,
    notes: splitNotes(source.notes),
    people: source.people.map(person => person.toListApi()),
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

// TODO: revisit old stuff here

function mapCitationsIncludePerson(citations) {
  return citations.map(citation => ({
    id: citation._id,
    information: citation.information,
    ...splitCitationItem(citation),
    person: {
      id: citation.person._id,
      name: citation.person.name,
    },
  }));
}

function splitCitationItem(citation) {
  const arr = citation.item.split(' - ');
  return { itemPart1: arr.shift(), itemPart2: arr.join(' ') };
}

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
