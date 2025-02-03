import _ from 'lodash';

import Event from './Event.model.js';

const eventFilters = {
  historical: {
    historical: true,
  },
  birth: {
    title: { $in: ['birth', 'birth and death'] },
    historical: { $in: [false, null] },
  },
  baptism: {
    title: { $in: ['christening', 'baptism'] },
    historical: { $in: [false, null] },
  },
  marriage: {
    $or: [
      { title: { $regex: 'marriage' } },
      { title: { $in: ['engagement', 'separation', 'divorce'] } },
    ],
    historical: { $in: [false, null] },
  },
  death: {
    title: { $in: ['death', 'birth and death', 'funeral'] },
    historical: { $in: [false, null] },
  },
  immigration: {
    title: { $in: ['immigration'] },
    historical: { $in: [false, null] },
  },
  military: {
    $or: [
      { title: { $regex: 'military' } },
      { title: { $regex: 'enlistment' } },
      { title: { $regex: 'discharge' } },
    ],
    historical: { $in: [false, null] },
  },
  other: {
    historical: { $in: [false, null] },
    $and: [
      {
        title: {
          $nin: [
            'birth',
            'birth and death',
            'christening',
            'baptism',
            'engagement',
            'separation',
            'divorce',
            'death',
            'funeral',
            'immigration',
          ],
        },
      },
      { title: { $not: { $regex: 'marriage' } } },
      { title: { $not: { $regex: 'military' } } },
      { title: { $not: { $regex: 'enlistment' } } },
      { title: { $not: { $regex: 'discharge' } } },
    ],
  },
};

export default async function listEventsRoute(req, res) {
  const category = req.query.category;

  const filter = category ? eventFilters[category] : {};

  if (!filter) {
    return res.status(400).send('invalid category');
  }

  const events = await Event.find(filter)
    .populatePeople()
    .populate('tags')
    .sort({ 'date.year': 1, 'date.month': 1, 'date.day': 1 })
    .select('title date location people notes tags tagValues');

  res.send({
    events: events.map(event => ({
      ..._.pick(event, ['id', 'title', 'location', 'notes']),
      date: {
        year: event.date.year || 0,
        month: event.date.month || 0,
        day: event.date.day || 0,
        display: event.date.display,
      },
      people: event.people.map(person => person.toListApi()),
      tags: event.getMappedTags(),
    })),
  });
}
