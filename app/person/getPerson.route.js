import _ from 'lodash';
import mongoose from 'mongoose';

import PersonModel, { PERSON_SHARE_LEVEL } from './Person.model.js';

const Event = mongoose.model('Event');
const Notation = mongoose.model('Notation');

const Person = PersonModel; // prefer PersonModel

const populateAvatarUrl = {
  path: 'avatar',
  select: 'file',
  populate: { path: 'file', select: 'key' },
};

export default async function getPerson(req, res) {
  const admin = req.session?.user?.admin;

  const personId = req.params.id;

  const person = await findPersonByValidId(personId)
    .populate({ path: 'parents', populate: populateAvatarUrl })
    .populate({ path: 'spouses', populate: populateAvatarUrl })
    .populate({ path: 'children', populate: populateAvatarUrl })
    .populateAvatar()
    .populate({ path: 'tags', select: 'title definition valueType values' });

  if (!person) {
    return res.status(404).send('Person not found');
  }

  if (!admin) {
    if (person.shareLevel === PERSON_SHARE_LEVEL.NONE) {
      return res.status(403).send('Not authorized');
    }

    // TODO: A restricted person may show up in the family lists of non-restricted
    // people, so should we show family lists on restricted person profile too?
    if (person.shareLevel === PERSON_SHARE_LEVEL.RESTRICTED) {
      return res.json({
        ...person.restrictedData(),
        private: true,
      });
    }
  }

  // The person is included in their own siblings list.
  const siblings = await Person.find({
    parents: { $in: person.parents },
  }).populateAvatar();

  const ancestorTree = await buildTree(person, admin);

  const birthAndDeathEvents = await Event.find({
    people: person,
    title: { $in: ['birth', 'death', 'birth and death'] },
  }).populatePeople();

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
    birth: mapBirthAndDeathEvent('birth', admin, birthAndDeathEvents),
    death: mapBirthAndDeathEvent('death', admin, birthAndDeathEvents),
    links: mapLinks(person.links),
    parents: sortAndMapPeople(person.parents, null, admin),
    siblings: sortAndMapPeople(siblings, 'birthYear', admin),
    spouses: sortAndMapPeople(person.spouses, null, admin),
    children: sortAndMapPeople(person.children, 'birthYear', admin),
    tags: mapTags(person.tags, person.tagValues),
    treeParents: ancestorTree.treeParents,
    gender: person.genderText(),
    profileSummary: profileSummaryNotations
      .map(notation => notation.text)
      .join(' '),
  };

  res.json(data);
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

function sortAndMapPeople(people, sortBy, admin) {
  // Sort (by birth year) even if the person's details will be restricted.
  const sorted = sortBy ? _.sortBy(people, sortBy) : people;

  // Eliminate unshared information. If a person is fully private, delete them.
  return sorted
    .map(person => person.toListApi({ restrict: !admin }))
    .filter(Boolean);
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

// Given either "birth" or "death" and a list of birth-and-death events
// for the person, find the relevant event and return the details for profile display.
// Events may be shared by multiple people, e.g., a twin birth.
function mapBirthAndDeathEvent(eventType, admin, events) {
  const event = events.find(
    event => event.title === eventType || event.title === 'birth and death',
  );

  if (!event) {
    return null;
  }

  // Events don't have their own share level. The "restrict" option could affect people
  // in the list if there is a multiple-person event.
  return event.toApi({ restrict: !admin });
}

async function buildTree(rootPerson, admin) {
  const allPeople = await Person.find({
    children: { $not: { $size: 0 } },
  })
    .populateAvatar()
    .select('id name parents avatar gender shareLevel');

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
      ...nextPerson.toListApi({ restrict: !admin }),
      treeParents,
    };
  }
}
