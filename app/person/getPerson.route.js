import mongoose from 'mongoose';

const Citation = mongoose.model('Citation');
const Person = mongoose.model('Person');

export default async function getPerson(req, res) {
  const personId = req.params.id;

  const person = await findPersonByValidId(personId)
    .populate('parents')
    .populate('spouses')
    .populate('children')
    .populate('tags');

  if (!person) {
    return res.status(404).send();
  }

  await person.populateSiblings({ sortByBirthDate: true });

  await person.populateCitations({ populateSources: true });
  await Citation.populateStories(person.citations);
  Citation.sortByItem(person.citations);

  const ancestorTree = await Person.getAncestorTree(person);

  const data = {
    id: person.id,
    children: mapPeopleToNameAndId(person.children),
    citations: mapCitationsIncludeSource(person.citations),
    links: mapLinks(person.links),
    name: person.name,
    parents: mapPeopleToNameAndId(person.parents),
    siblings: mapPeopleToNameAndId(person.siblings),
    spouses: mapPeopleToNameAndId(person.spouses),
    shareLevel: person.shareLevel,
    tags: person.convertTags({ asList: true }),
    treeParents: ancestorTree.treeParents,
  };

  res.json({ person: data });
}

////////////////////

function findPersonByValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
    ? Person.findById(id)
    : Person.findById(null); // This is chainable; simply returning null would not be.
}

function mapCitationsIncludeSource(citations) {
  return citations.map(citation => ({
    id: citation._id,
    information: citation.information,
    ...splitCitationItem(citation),
    source: {
      id: citation.source._id,
      fullTitle: citation.source.fullTitle,
    },
  }));
}

function mapLinks(links) {
  return links.map(link => {
    const arr = link.split(' ');
    return { url: arr.shift(), text: arr.join(' ') };
  });
}

function mapPeopleToNameAndId(people) {
  return people.map(person => ({ id: person._id, name: person.name }));
}

function splitCitationItem(citation) {
  const arr = citation.item.split(' - ');
  return { itemPart1: arr.shift(), itemPart2: arr.join(' ') };
}
