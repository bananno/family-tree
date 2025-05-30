import mongoose from 'mongoose';

import tools from '../tools/modelTools.js';

const methods = {};

methods.sortByDate = tools.sorting.sortByDate;

methods.getAllSharedData = async () => {
  const Event = mongoose.model('Event');
  const exportFieldNames = ['_id', 'title', 'date', 'location', 'people', 'notes'];
  const rawList = await Event.find({}).populate('people').populate('tags');

  const eventList = rawList.map(event => {
    // A historical event with NO people in the list is a global event. Always include.
    if (event.people.length == 0 && event.hasTag('historical')) {
      return event;
    }

    // Remove non-shared people from the event.
    // Then un-populate people, leaving _id only.
    event.people = event.people.map(person => {
      return person.shareLevel === 2 ? person._id : false;
    }).filter(Boolean);

    // Keep (share) the event IF it applies to at least one shared person.
    if (event.people.length > 0) {
      return event;
    }

    // Discard all other events.
    return false;
  }).filter(Boolean);

  const newList = tools.reduceListToExportData(eventList, exportFieldNames);

  Event.sortByDate(newList);

  return newList;
};

methods.getFormDataNew = req => {
  const eventTitle = req.body.title.trim();

  if (eventTitle == '') {
    return null;
  }

  const newEvent = {
    title: eventTitle,
    people: [],
    date: req.getFormDataDate(),
    location: req.getFormDataLocation(),
  };

  return newEvent;
};

export default methods;