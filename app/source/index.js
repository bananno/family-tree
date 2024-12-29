import {
  Highlight,
  Notation,
  Source,
  createController,
} from '../import.js';

import { mainSourceTypes } from './constants.js';
import sourceForm from './forms.js';
import sourceProfile from './show.js';
import sourceTools from './tools.js';

export default function createRoutes(router) {
  router.param('id', sourceTools.convertParamSourceId1);
  router.param('sourceId', sourceTools.convertParamSourceId2);

  router.use(sourceTools.createRenderSource);

  createController({
    Model: Source,
    modelName: 'source',
    router,
    routes: {
      index: getSourcesIndex('none'),
      create: createSource,
      delete: deleteSource,
      show: sourceProfile.summary,
      edit: sourceProfile.edit,
      other: sourceProfile.other,
    },
  });

  mainSourceTypes.forEach(sourceType => {
    router.get('/sources/' + sourceType, getSourcesIndex(sourceType));
  });

  router.post('/source/:id/createCitationNotation', createSourceCiteNotation);
  router.post('/source/:id/createHighlight', createSourceHighlight);
  router.post('/source/:id/createNotation', createSourceNotation);

  router.get('/forms/census', sourceForm.getNewSourceForm);
  router.get('/source/:id/form', sourceForm.getSourceForm);
  router.post('/source/:id/form', sourceForm.saveSourceForm);
}

////////////////////

function getSourcesIndex(subview) {
  return async function(req, res) {
    const sources = await sourceTools.getSourcesByType(subview);
    Source.sortByStory(sources);
    res.render('source/index', {
      title: 'Sources',
      sources,
      subview,
      mainSourceTypes,
    });
  };
}

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
