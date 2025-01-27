import _ from 'lodash';

import Event from '../event/Event.model.js';
import Source from '../source/Source.model.js';

import Person from './Person.model.js';

const populatePeople = {
  path: 'people',
  populate: {
    path: 'avatar',
    select: 'file',
    populate: {
      path: 'file',
      select: 'key',
    },
  },
  select: 'name gender avatar profileImage',
};

const populateStory = {
  path: 'story',
  select: 'title type',
};

export default async function getPersonTimelineRoute(req, res) {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send();
  }

  const {
    events: personalEvents,
    birthYear,
    deathYear,
  } = await getPersonalEvents(person);

  const moreItems = await Promise.all([
    getParentEvents(person, deathYear),
    getSpouseEvents(person),
    getChildEvents(person, deathYear),
    getHistoricalEvents(birthYear, deathYear),
    getSourceEvents(person),
  ]);

  const timelineItems = [personalEvents, ...moreItems].flat();

  const sortedItems = _.sortBy(timelineItems, [
    'date.year',
    'date.month',
    'date.day',
  ]);

  res.json({
    data: sortedItems,
  });
}

////////////////////

// Death events only if during the person's lifetime (or shortly after their death).
async function getParentEvents(person, deathYear) {
  const eventFilter = {
    people: { $in: person.parents },
    title: 'death',
  };

  if (deathYear) {
    eventFilter['date.year'] = { $lte: deathYear };
  }

  const events = await Event.find(eventFilter).populate(populatePeople);

  return mapEventsToTimelineItems(events, 'parent');
}

// All events that are attached to the person directly.
// Also find their birth and death years for filtering other types of events.
async function getPersonalEvents(person) {
  const events = await Event.find({
    people: person,
  }).populate(populatePeople);

  const birthYear = events.find(event =>
    ['birth', 'birth and death'].includes(event.title)
  )?.date?.year;

  const deathYear = events.find(event =>
    ['death', 'birth and death'].includes(event.title)
  )?.date?.year;

  return {
    events: mapEventsToTimelineItems(events, 'personal'),
    birthYear,
    deathYear,
  };
}

// All child birth events.
// Death events only if during the person's lifetime (or shortly after their death).
async function getChildEvents(person, deathYear) {
  const birthEventFilter = {
    title: { $in: ['birth', 'birth and death'] },
  };

  const deathEventFilter = {
    title: 'death',
  };

  if (deathYear) {
    deathEventFilter['date.year'] = { $lte: deathYear };
  }

  const events = await Event.find({
    people: { $in: person.children },
    $or: [birthEventFilter, deathEventFilter],
  }).populate(populatePeople);

  return mapEventsToTimelineItems(events, 'child');
}

// Spouse birth and death events. No year filtering.
async function getSpouseEvents(person) {
  const events = await Event.find({
    people: { $in: person.spouses },
    title: { $in: ['birth', 'death'] },
  }).populate(populatePeople);

  return mapEventsToTimelineItems(events, 'spouse');
}

// All generic historical events (i.e., not attached to any people)
// during the person's lifetime.
async function getHistoricalEvents(birthYear, deathYear) {
  if (!birthYear || !deathYear) {
    return [];
  }

  const events = await Event.find({
    people: { $size: 0 },
    date: {
      $gte: { year: birthYear },
      $lte: { year: deathYear },
    },
    historical: true,
  }).populate(populatePeople);

  return mapEventsToTimelineItems(events, 'historical');
}

async function getSourceEvents(person) {
  const sources = await Source.find({ people: person })
    .populate(populateStory)
    .populate(populatePeople)
    .populate('images');

  return sources.map(source => {
    return {
      ..._.pick(source, ['id', 'title', 'date', 'location']),
      model: 'source',
      title: `${source.story.title} - ${source.title}`,
      timelineType: storyToTimelineType(source.story),
      people: source.people.map(person => person.toListApi()),
      imageUrl: source.images[0]?.url,
    };
  });
}

function mapEventsToTimelineItems(events, timelineType) {
  return events.map(event => ({
    ..._.pick(event, ['id', 'title', 'date', 'location']),
    model: 'event',
    timelineType: event.historical ? 'historical' : timelineType,
    people: event.people.map(person => person.toListApi()),
  }));
}

function storyToTimelineType(story) {
  if (story.type == 'newspaper') {
    return story.type;
  }
  if (story.type == 'document' && story.title.match('Census')) {
    return 'census';
  }
  return 'source';
}
