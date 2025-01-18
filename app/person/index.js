import { Event, Notation, createController } from '../import.js';

import * as personTools from './tools.js';
import personProfileRoutes from './profile.js';

import Person from './Person.model.js';

export default function createRoutes(router) {
  router.param('id', personTools.convertParamPersonId1);
  router.param('personId', personTools.convertParamPersonId2);
  router.use(personTools.createRenderPersonProfile);

  createController({
    Model: Person,
    modelName: 'person',
    modelNamePlural: 'people',
    router,
    routes: {
      show: personProfileRoutes.show,
      edit: personProfileRoutes.edit,
      delete: null,
      other: personProfileRoutes.other,
    },
  });

  router.post('/person/:id/add/events', createPersonEvent);
  router.post('/person/:id/add/notations', createPersonNotation);
  router.post('/person/:id/add/namedLink', addNamedLink);

  router.get('/person/:id/descendants/generation/:generation',
    personProfileRoutes.other.descendants);
}

////////////////////

async function createPersonEvent(req, res) {
  const newEvent = Event.getFormDataNew(req);

  if (!newEvent) {
    return res.send('error');
  }

  newEvent.people.push(req.person);

  await Event.create(newEvent);

  res.redirect('/person/' + req.paramPersonId + '/timeline');
}

async function createPersonNotation(req, res) {
  const newNotation = Notation.getFormDataNew(req);

  if (!newNotation) {
    return res.send('error');
  }

  newNotation.people.push(req.person);

  await Notation.create(newNotation);

  res.redirect('/person/' + req.paramPersonId + '/notations');
}

async function addNamedLink(req, res) {
  const url = req.body.url;
  if (!url) {
    return res.send('missing link text');
  }
  const newLink = url + ' ' + req.body.title;
  const links = [...req.person.links, newLink];
  await Person.updateOne({_id: req.person._id}, {links});
  res.redirect('/person/' + req.paramPersonId + '/edit');
}
