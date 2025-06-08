import mongoose from 'mongoose';

import { createController } from '../import.js';

import sourceForm from './forms.js';
import sourceProfile from './show.js';
import sourceTools from './tools.js';

const Highlight = mongoose.model('Highlight');
const Notation = mongoose.model('Notation');
const Source = mongoose.model('Source');

export default function createRoutes(router) {
  router.param('id', sourceTools.convertParamSourceId1);
  router.param('sourceId', sourceTools.convertParamSourceId2);

  router.use(sourceTools.createRenderSource);

  createController({
    Model: Source,
    modelName: 'source',
    router,
    routes: {
      create: createSource,
      delete: deleteSource,
      show: sourceProfile.summary,
      edit: sourceProfile.edit,
      other: sourceProfile.other,
    },
  });

  router.post('/source/:id/createCitationNotation', createSourceCiteNotation);
  router.post('/source/:id/createHighlight', createSourceHighlight);
  router.post('/source/:id/createNotation', createSourceNotation);

  router.get('/forms/census', sourceForm.getNewSourceForm);
  router.get('/source/:id/form', sourceForm.getSourceForm);
  router.post('/source/:id/form', sourceForm.saveSourceForm);
}

////////////////////

async function createSource(req, res) {
  const newSource = Source.getFormDataNew(req);

  if (!newSource) {
    return res.send('error');
  }

  const source = await Source.create(newSource);
  res.redirect(`/source/${source._id}/edit`);
}

async function deleteSource(req, res) {
  await Source.deleteOne({_id: req.sourceId});
  res.redirect('/sources');
}

async function createSourceCiteNotation(req, res) {
  const newNotation = Notation.getFormDataNew(req);
  newNotation.source = req.sourceId;
  await Notation.create(newNotation);
  res.redirect('/source/' + req.sourceId + '/edit');
}

async function createSourceHighlight(req, res) {
  const newHighlight = await Highlight.createFromForm(req);
  if (newHighlight.error) {
    return res.send(newHighlight);
  }
  res.redirect('/source/' + req.sourceId + '/highlights');
}

async function createSourceNotation(req, res) {
  const newNotation = Notation.getFormDataNew(req);
  newNotation.source = req.sourceId;
  await Notation.create(newNotation);
  res.redirect('/source/' + req.sourceId + '/notations');
}
