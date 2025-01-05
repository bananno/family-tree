import _ from 'lodash';
import mongoose from 'mongoose';

import Person from './Person.model.js';

// COPIED From the old version. TODO: refactor
export default async function getPersonTimelineRoute(req, res) {
  const Event = mongoose.model('Event');
  const Source = mongoose.model('Source');

  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send();
  }

  const allEvents = await Event.find({}).populate('people');

  Event.sortByDate(allEvents);

  const events = filterEvents(allEvents, person);

  const sources = await Source.find({ people: person })
    .populate('people')
    .populate('story')
    .populate('images');

  const sourceEvents = sources.map(convertSourceToEvent);

  const timelineItems = [...events, ...sourceEvents];

  Event.sortByDate(timelineItems);

  res.json({
    data: timelineItems.map(item => {
      return {
        ..._.pick(item, ['id', 'timelineType', 'title']),
        // people: item.people.map(person => person.toListApi()),
      };
    }),
  });
}

////////////////////

function convertSourceToEvent(source) {
  const event = {
    id: source.id,
    model: 'Source',
    title: source.story.title + ' - ' + source.title,
    date: { ...source.date },
    location: { ...source.location },
    people: [...source.people],
    source: source,
  };

  if (source.story.type == 'newspaper') {
    event.timelineType = source.story.type;
  } else if (
    source.story.type == 'document' &&
    source.story.title.match('Census')
  ) {
    event.timelineType = 'census';
  } else {
    event.timelineType = 'source';
  }

  return event;
}

function filterEvents(events, person) {
  const children = person.children;
  const spouses = person.spouses;
  let birthYear, deathYear;

  events = events.map(thisEvent => {
    thisEvent.id = String(thisEvent._id);
    thisEvent.timelineType = null;

    // Historical events that have no people in the list are global events.
    // Always include them if they are during the person's life.
    if (thisEvent.hasTag('historical') && thisEvent.people.length == 0) {
      if (
        !birthYear ||
        !thisEvent.date ||
        thisEvent.date.year < birthYear ||
        (deathYear && thisEvent.date.year > deathYear)
      ) {
        return null;
      }

      thisEvent.timelineType = 'historical';
      return thisEvent;
    }

    for (let i = 0; i < thisEvent.people.length; i++) {
      if (Person.isSame(thisEvent.people[i], person)) {
        thisEvent.timelineType = 'personal';
        if (
          thisEvent.title == 'birth' ||
          thisEvent.title == 'birth and death'
        ) {
          birthYear = thisEvent.date ? thisEvent.date.year : null;
        }
        if (
          thisEvent.title == 'death' ||
          thisEvent.title == 'birth and death'
        ) {
          deathYear = thisEvent.date ? thisEvent.date.year : null;
        }
        return thisEvent;
      }
    }

    for (let i = 0; i < thisEvent.people.length; i++) {
      for (let j = 0; j < spouses.length; j++) {
        if (Person.isSame(thisEvent.people[i], spouses[j])) {
          thisEvent.timelineType = 'spouse';
          return thisEvent;
        }
      }
    }

    if (birthYear && thisEvent.date && thisEvent.date.year < birthYear) {
      return thisEvent;
    }

    if (deathYear && thisEvent.date && thisEvent.date.year > deathYear) {
      return thisEvent;
    }

    for (let i = 0; i < thisEvent.people.length; i++) {
      for (let j = 0; j < children.length; j++) {
        if (Person.isSame(thisEvent.people[i], children[j])) {
          thisEvent.timelineType = 'child';
          return thisEvent;
        }
      }
    }

    return thisEvent;
  });

  return events.filter(event => event && event.timelineType);
}
