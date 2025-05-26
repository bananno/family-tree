import '../testDb.js';
import { expectResStatus, res } from '../testTools.js';

import getPersonTimelineRoute from '../../app/person/getPersonTimeline.route.js';

import Event from '../../app/event/Event.model.js';
import Person, { PERSON_GENDER } from '../../app/person/Person.model.js';
import Source from '../../app/source/Source.model.js';
import Story from '../../app/story/Story.model.js';

const personId = '5bce02694df8a32e9026e654';

const req = {
  params: {
    id: personId,
  },
};

let expectedResponse;

beforeAll(async () => {
  const parent = new Person({ name: 'Parent One', children: [personId] });
  const spouse = new Person({ name: 'Spouse One', spouses: [personId] });
  const child1 = new Person({ name: 'Child One', parents: [parentId] });
  const child2 = new Person({ name: 'Child Two', parents: [parentId] });
  const child3 = new Person({ name: 'Child Three', parents: [parentId] });

  await Promise.all([
    parent.save(),
    spouse.save(),
    child1.save(),
    child2.save(),
    child3.save(),
  ]);

  const parentId = parent.id;
  const spouseId = spouse.id;
  const childId1 = child1.id;
  const childId2 = child2.id;
  const childId3 = child3.id;

  const mainPerson = new Person({
    _id: personId,
    name: 'The Person',
    parents: [parentId],
    spouses: [spouseId],
    children: [childId1, childId2, childId3],
    profileImage: 'profile.jpg',
    gender: PERSON_GENDER.MALE,
  });

  const promises = [mainPerson.save()];

  function addEvent(data) {
    const record = new Event(data);
    promises.push(record.save());
    return record;
  }

  function addStory(data) {
    const record = new Story(data);
    promises.push(record.save());
    return record;
  }

  // All of the main person's direct events, whether primary events or miscellaneous,
  // should always be included.
  const mainPersonBirth = addEvent({
    title: 'birth',
    people: [personId],
    date: { year: 1900, month: 1, day: 2 },
  });
  const mainPersonMiscEvent = addEvent({
    title: 'random thing in 1915',
    people: [personId],
    date: { year: 1915, month: 7, day: 10 },
  });
  const mainPersonDeath = addEvent({
    title: 'death',
    people: [personId],
    date: { year: 1999 },
  });

  // Parent's death should be included if during the person's life.
  addEvent({
    title: 'birth',
    people: [parentId],
    date: { year: 1870, month: 1, day: 2 },
  });
  const parentDeath = addEvent({
    title: 'death',
    people: [parentId],
    date: { year: 1950, month: 7, day: 10 },
  });

  // Spouse's birth and death events should be included.
  const spouseBirth = addEvent({
    title: 'birth',
    people: [spouseId],
    date: { year: 1899 },
  });
  const spouseDeath = addEvent({
    title: 'death',
    people: [spouseId],
    date: { year: 1934 },
  });
  addEvent({
    title: 'exclude me 1905',
    people: [spouseId],
    date: { year: 1905 },
  });

  // Child's birth should be included.
  const childBirth1 = addEvent({
    title: 'birth',
    people: [childId1],
    date: { year: 1929, month: 10, day: 12 },
  });
  const childBirth2 = addEvent({
    title: 'birth',
    people: [childId2],
    date: { year: 1931 },
  });

  // Child "birth and death" events should be included.
  const childBirthAndDeath3 = addEvent({
    title: 'birth and death',
    people: [childId3],
    date: { year: 1932 },
  });

  // Child's death should only be included if during the person's life.
  const childDeath1 = addEvent({
    title: 'death',
    people: [childId1],
    date: { year: 1929, month: 11, day: 1 },
  });
  addEvent({
    title: 'death',
    people: [childId2],
    date: { year: 2001 },
  });

  // Include historical events which are attached to the person.
  // Include generic historical events during the person's life.
  // Do not include historical events that are attached to another person.
  const historicalEvent1 = addEvent({
    title: 'generic historical event in 1980',
    people: [],
    date: { year: 1980 },
    historical: true,
  });
  addEvent({
    title: "someone else's historical event in 1981",
    people: [childId2],
    date: { year: 1981 },
    historical: true,
  });
  const historicalEvent3 = addEvent({
    title: 'relevant historical event in 1982',
    people: [personId],
    date: { year: 1982 },
    historical: true,
  });

  // Create stories: one of each "timelineType".
  const newspaperStory = addStory({
    type: 'newspaper',
    title: 'The Newspaper',
  });
  const censusStory = addStory({ type: 'document', title: '1920 Census' });
  const documentStory = addStory({ type: 'document', title: 'Misc Document' });
  const otherStory = addStory({ type: 'other', title: 'Something Else' });

  // Save person, events, and stories.
  await Promise.all(promises);

  // Create sources
  const censusSource = new Source({
    story: censusStory.id,
    people: [personId],
    date: { year: 1920 },
    title: 'The Whole Family',
  });
  const newspaperSource = new Source({
    story: newspaperStory.id,
    people: [personId],
    date: { year: 1921 },
    title: '1921 newspaper article',
  });
  const documentSource = new Source({
    story: documentStory.id,
    people: [personId],
    date: { year: 1922 },
    title: 'A Document from 1922',
  });
  const otherSource = new Source({
    story: otherStory.id,
    people: [personId],
    date: { year: 1923 },
    title: 'A Source from 1923',
  });

  await Promise.all([
    newspaperSource.save(),
    censusSource.save(),
    documentSource.save(),
    otherSource.save(),
  ]);

  const timelineItems = [
    // Personal events, spouse birth.
    { title: 'birth', id: spouseBirth.id, timelineType: 'spouse' },
    {
      title: 'birth',
      id: mainPersonBirth.id,
      timelineType: 'personal',
      people: [
        expect.objectContaining({
          id: personId,
          name: 'The Person',
          gender: 'male',
          avatarUrl: 'profile.jpg',
        }),
      ],
    },
    {
      title: 'random thing in 1915',
      id: mainPersonMiscEvent.id,
      timelineType: 'personal',
    },
    // Sources.
    {
      title: '1920 Census - The Whole Family',
      id: censusSource.id,
      timelineType: 'census',
    },
    {
      title: 'The Newspaper - 1921 newspaper article',
      id: newspaperSource.id,
      timelineType: 'newspaper',
    },
    {
      title: 'Misc Document - A Document from 1922',
      id: documentSource.id,
      timelineType: 'source',
    },
    {
      title: 'Something Else - A Source from 1923',
      id: otherSource.id,
      timelineType: 'source',
    },
    // Family births + deaths.
    { title: 'birth', id: childBirth1.id, timelineType: 'child' },
    { title: 'death', id: childDeath1.id, timelineType: 'child' },
    { title: 'birth', id: childBirth2.id, timelineType: 'child' },
    {
      title: 'birth and death',
      id: childBirthAndDeath3.id,
      timelineType: 'child',
      date: { year: 1932 },
    },
    {
      title: 'death',
      id: spouseDeath.id,
      timelineType: 'spouse',
      date: { year: 1934 },
    },
    {
      title: 'death',
      id: parentDeath.id,
      timelineType: 'parent',
      date: { year: 1950 },
    },
    // Historical events.
    {
      title: 'generic historical event in 1980',
      id: historicalEvent1.id,
      timelineType: 'historical',
    },
    {
      title: 'relevant historical event in 1982',
      id: historicalEvent3.id,
      timelineType: 'historical',
    },
    {
      title: 'death',
      id: mainPersonDeath.id,
      timelineType: 'personal',
      date: { year: 1999 },
    },
  ];

  expectedResponse = timelineItems.map(item => {
    if (item.date) {
      item.date = expect.objectContaining(item.date);
    }
    return expect.objectContaining(item);
  });
});

async function callRoute() {
  await getPersonTimelineRoute(req, res);
}

describe('getPersonTimelineRoute', () => {
  describe('when the person is found', () => {
    beforeEach(async () => {
      req.params.id = personId;
      await callRoute();
    });

    it('sends the response', () => {
      expect(res.json).toHaveBeenCalledWith({ data: expectedResponse });
    });
  });

  describe('when the person is not found', () => {
    beforeEach(async () => {
      req.params.id = '9f26466eb15c910cf66e0df8';
      await callRoute();
    });

    it('sends a 404 response', () => {
      expectResStatus(404);
    });
  });
});
