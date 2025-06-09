import { Notation, Person, Source } from '../import.js';

export default function createRoutes(router) {
  router.get('/api/notation-profile/:id', notationProfile);
  router.get('/api/person-index', personIndex);
  router.get('/api/source-profile/:id', sourceProfile);
}

async function notationProfile(req, res) {
  const notation = await Notation
    .findById(req.params.id)
    .populate('people')
    .populate('stories')
    .populate('tags');
  const data = {
    id: notation._id,
    title: notation.title,
    sharing: notation.sharing,
    text: notation.text,
    people: mapPeopleToNameAndId(notation.people),
    stories: notation.stories.map(story => ({id: story._id, title: story.title})),
    tags: notation.convertTags({asList: true}),
  };
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send({data});
}

async function personIndex(req, res) {
  const people = await Person.find()
    .populateAvatar()
    .select('name gender avatar');
  const data = people.map(person => person.toListApi());
  res.send({ data });
}

async function sourceProfile(req, res) {
  const source = await Source.findById(req.params.id)
    .populate('story')
    .populate('tags')
    .populatePeople();

  await source.populateAndSortCitations();

  const data = {
    id: source._id,
    citations: mapCitationsIncludePerson(source.citationsByPerson),
    content: source.content?.split('\n') || [],
    date: source.date,
    links: mapLinks(source.links),
    location: source.location,
    notes: splitNotes(source.notes),
    people: source.people.map(person => person.toListApi()),
    sharing: source.sharing,
    tags: source.convertTags({asList: true}),
    title: source.title,
    story: {
      id: source.story._id,
      title: source.story.title,
      type: source.story.type,
    },
  };

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send({data});
}

////////////////////

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
  return {itemPart1: arr.shift(), itemPart2: arr.join(' ')};
}

function mapLinks(links) {
  return links.map(link => {
    const arr = link.split(' ');
    return {url: arr.shift(), text: arr.join(' ')};
  });
}

function mapPeopleToNameAndId(people) {
  return people.map(person => ({id: person._id, name: person.name}));
}

function splitNotes(notes) {
  if (!notes) {
    return [];
  }
  return notes.split('\n').map(s => s.trim()).filter(Boolean);
}
