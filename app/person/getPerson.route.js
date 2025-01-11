import _ from 'lodash';
import mongoose from 'mongoose';

const Citation = mongoose.model('Citation');
const Event = mongoose.model('Event');
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

  await person.populateBirthAndDeath();

  await person.populateSiblings({ sortByBirthDate: true });

  await person.populateCitations({ populateSources: true });
  await Citation.populateStories(person.citations);
  Citation.sortByItem(person.citations);

  const ancestorTree = await Person.getAncestorTree(person);

  // Redundant to fetch the person's birth/death but then they can be cleanly
  // included in the sibling list.
  await populateBirthAndDeathYears([
    person,
    ...person.parents,
    ...person.siblings,
    ...person.spouses,
    ...person.children,
  ]);

  const data = {
    ..._.pick(person, [
      'id',
      'name',
      'profileImage',
      'birth',
      'death',
      'shareLevel',
      'living',
      'createdAt',
      'updatedAt',
    ]),
    citations: mapCitationsIncludeSource(person.citations),
    links: mapLinks(person.links),
    parents: person.parents.map(person => person.toListApi()),
    siblings: _.sortBy(
      [...person.siblings, person].map(person => person.toListApi()),
      'birthYear'
    ),
    spouses: person.spouses.map(person => person.toListApi()),
    children: _.sortBy(
      person.children.map(person => person.toListApi()),
      'birthYear'
    ),
    tags: person.convertTags({ asList: true }),
    treeParents: ancestorTree.treeParents,
    gender: person.genderText(),
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

async function populateBirthAndDeathYears(people) {
  const events = await Event.find({
    people: { $in: people },
    title: { $in: ['birth', 'death', 'birth and death'] },
  }).select('title people date.year');

  events.forEach(event => {
    event.people = event.people.map(person => String(person));
  });

  const birthEvents = events.filter(event =>
    ['birth', 'birth and death'].includes(event.title)
  );
  const deathEvents = events.filter(event =>
    ['death', 'birth and death'].includes(event.title)
  );

  people.forEach(person => {
    person.birthYear = birthEvents.find(event =>
      event.people.includes(person.id)
    )?.date.year;
    person.deathYear = deathEvents.find(event =>
      event.people.includes(person.id)
    )?.date.year;
  });
}

function splitCitationItem(citation) {
  const arr = citation.item.split(' - ');
  return { itemPart1: arr.shift(), itemPart2: arr.join(' ') };
}
