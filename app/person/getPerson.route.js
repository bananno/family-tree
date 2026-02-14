import _ from 'lodash';
import mongoose from 'mongoose';

const Event = mongoose.model('Event');
const Notation = mongoose.model('Notation');
const Person = mongoose.model('Person');

const populateAvatarUrl = {
  path: 'avatar',
  select: 'file',
  populate: { path: 'file', select: 'key' },
};

export default async function getPerson(req, res) {
  const personId = req.params.id;

  const person = await findPersonByValidId(personId)
    .populate({ path: 'parents', populate: populateAvatarUrl })
    .populate({ path: 'spouses', populate: populateAvatarUrl })
    .populate({ path: 'children', populate: populateAvatarUrl })
    .populateAvatar()
    .populate({ path: 'tags', select: 'title definition valueType values' });

  if (!person) {
    return res.status(404).send();
  }

  // The person is included in their own siblings list.
  const siblings = await Person.find({
    parents: { $in: person.parents },
  }).populateAvatar();

  const ancestorTree = await buildTree(person);

  await populateBirthAndDeathEvents(person);
  await populateBirthAndDeathYears([
    person,
    ...siblings,
    ...person.parents,
    ...person.spouses,
    ...person.children,
  ]);

  const profileSummaryNotations = await Notation.find({
    people: person,
    title: 'profile summary',
  });

  const data = {
    ..._.pick(person, [
      'id',
      'name',
      'shareLevel',
      'shareName',
      'living',
      'createdAt',
      'updatedAt',
      'customId',
    ]),
    avatarUrl: person.avatarUrl() || person.profileImage,
    birth: mapBirthAndDeathEvent(person.birth),
    death: mapBirthAndDeathEvent(person.death),
    links: mapLinks(person.links),
    parents: person.parents.map(person => person.toListApi()),
    siblings: _.sortBy(
      siblings.map(person => person.toListApi()),
      'birthYear',
    ),
    spouses: person.spouses.map(person => person.toListApi()),
    children: _.sortBy(
      person.children.map(person => person.toListApi()),
      'birthYear',
    ),
    tags: mapTags(person.tags, person.tagValues),
    treeParents: ancestorTree.treeParents,
    gender: person.genderText(),
    profileSummary: profileSummaryNotations
      .map(notation => notation.text)
      .join(' '),
  };

  res.json({ person: data });
}

////////////////////

function findPersonByValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
    ? Person.findById(id)
    : Person.findById(null); // This is chainable; simply returning null would not be.
}

function mapLinks(links) {
  return links.map(link => {
    const arr = link.split(' ');
    const url = arr.shift();
    const text = arr.join(' ') || url;
    return { url, text };
  });
}

function mapTags(tags, tagValues) {
  return tags.map((tag, index) => ({
    id: tag.id,
    title: tag.title,
    value: tagValues[index] || '',
    definition: tag.definition,
    expectsValue: tag.expectsValue(),
    valueOptions: tag.valueOptions(),
  }));
}

async function populateBirthAndDeathEvents(person) {
  const Event = mongoose.model('Event');

  person.birth = await Event.findOne({
    people: person,
    title: { $in: ['birth', 'birth and death'] },
  }).populatePeople();

  person.death = await Event.findOne({
    people: person,
    title: { $in: ['death', 'birth and death'] },
  }).populatePeople();
}

async function populateBirthAndDeathYears(people) {
  const events = await Event.find({
    people: { $in: people },
    title: { $in: ['birth', 'death', 'birth and death'] },
  }).select('title people date.year');

  events.forEach(event => {
    event.people = event.people.map(person => String(person._id));
  });

  const birthEvents = events.filter(event =>
    ['birth', 'birth and death'].includes(event.title),
  );
  const deathEvents = events.filter(event =>
    ['death', 'birth and death'].includes(event.title),
  );

  people.forEach(person => {
    person.birthYear = birthEvents.find(event =>
      event.people.includes(person.id),
    )?.date.year;
    person.deathYear = deathEvents.find(event =>
      event.people.includes(person.id),
    )?.date.year;
  });
}

function mapBirthAndDeathEvent(event) {
  if (!event) {
    return null;
  }
  return {
    ..._.pick(event, ['title', 'date', 'location', 'notes']),
    people: event.people.map(person => person.toListApi()),
  };
}

async function buildTree(rootPerson) {
  const allPeople = await Person.find({
    children: { $not: { $size: 0 } },
  })
    .populateAvatar()
    .select('id name parents avatar gender');

  const map = {};

  allPeople.forEach(person => {
    map[person.id] = person;
  });

  return expandBranch(rootPerson, 0);

  function expandBranch(nextPerson, safety) {
    if (safety > 30) {
      return;
    }

    const treeParents = nextPerson.parents.map(parent => {
      const foundParent = map[String(parent._id)];
      return expandBranch(foundParent, safety + 1);
    });

    if (treeParents.length === 1) {
      treeParents.push(null);
    }

    return {
      ...nextPerson.toListApi(),
      treeParents,
    };
  }
}
