import mongoose from 'mongoose';

import { createController } from '../import.js';

import * as eventTools from './tools.js';

const Event = mongoose.model('Event');

export default function createRoutes(router) {
  router.use(createRenderEvent);

  createController({
    Model: Event,
    modelName: 'event',
    router,
    routes: {
      index: eventIndex,
      create: createEvent,
      delete: deleteEvent,
      show: showEvent,
      edit: editEvent,
    },
  });
}

////////////////////

function createRenderEvent(req, res, next) {
  res.renderEvent = (subview, options = {}) => {
    res.render('event/_layout', {
      subview,
      rootPath: req.rootPath || '/event/' + req.event._id,
      title: options.title || 'Event',
      event: req.event,
      ...options
    });
  };
  next();
}

async function eventIndex(req, res) {
  const events = await Event.find({})
    .populate('people')
    .populate('tags');

  Event.sortByDate(events);

  res.render('event/index', {title: 'All Events', events});
}

function createEvent(req, res) {
  const newEvent = Event.getFormDataNew(req);

  if (!newEvent) {
    return res.send('error');
  }

  Event.create(newEvent, (err, event) => {
    if (err) {
      res.send('There was a problem adding the information to the database.');
    } else {
      res.redirect('/event/' + event._id);
    }
  });
}

async function deleteEvent(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.send('event not found');
  }
  await Event.deleteOne({ _id: req.params.id });
  res.redirect('/events');
}

async function showEvent(req, res) {
  req.event = await Event.findById(req.params.id)
    .populate('people').populate('tags');
  if (!req.event) {
    return res.send('event not found');
  }
  const data = await eventTools.getShowEventInfo(req.event);
  res.renderEvent('show', data);
}

async function editEvent(req, res) {
  const {event, rootPath, data} = await eventTools.getEditEventInfo(req.params.id);
  if (!event) {
    return res.send('event not found');
  }
  req.event = event;
  req.rootPath = rootPath;
  res.renderEvent('edit', data);
}
