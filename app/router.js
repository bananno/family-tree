import express from 'express';

import * as routerTools from './tools/routerTools.js';

import apiCreateRoutes from './api/index.js';
import checklistCreateRoutes from './checklist/index.js';
import citationCreateRoutes from './citation/index.js';
import eventCreateRoutes from './event/index.js';
import exportFullDataRoute from './export/exportFullData.route.js';
import exportPublishedDataRoute from './export/exportPublishedData.route.js';
import {
  uploadFileMiddleware,
  createUploadedFileRoute,
  listUploadedFilesRoute,
} from './file/uploadedFileRoutes.js';
import * as featuredQuoteRoutes from './misc/featuredQuoteRoutes.js';
import highlightCreateRoutes from './highlight/index.js';
import imageCreateRoutes from './image/index.js';
import placeCreateRoutes from './place/index.js';
import mapCreateRoutes from './map/index.js';
import miscCreateRoutes from './misc/index.js';
import notationCreateRoutes from './notation/index.js';

// Person
import personCreateRoutes from './person/index.js';
import createPersonRoute from './person/createPerson.route.js';
import getPersonRoute from './person/getPerson.route.js';
import getPersonChecklistRoute from './person/getPersonChecklist.route.js';
import getPersonPhotosRoute from './person/getPersonPhotos.route.js';
import getPersonTimelineRoute from './person/getPersonTimeline.route.js';

import sourceCreateRoutes from './source/index.js';
import storyCreateRoutes from './story/index.js';
import tagCreateRoutes from './tag/index.js';

const router = express.Router();

export default router;

router.use((req, res, next) => {
  res.renderOriginal = res.render;

  res.render = (view, options) => {
    if (view === 'layout') {
      // phase out
      return res.renderOriginal(view, options);
    }
    return res.renderOriginal('layout', { view, ...options });
  };

  req.getFormDataDate = () => routerTools.getFormDataDate(req);
  req.getFormDataLocation = () => routerTools.getFormDataLocation(req);
  req.getFormDataTags = () => routerTools.getFormDataTags(req);

  next();
});

// HOME

router.get('/', (req, res) => {
  res.render('index', { title: null });
});

// RESOURCES

apiCreateRoutes(router);
checklistCreateRoutes(router);
citationCreateRoutes(router);
eventCreateRoutes(router);

router.get('/export/full', exportFullDataRoute);
router.get('/export/publish', exportPublishedDataRoute);

router.get('/featured-quotes', featuredQuoteRoutes.listFeaturedQuotesRoute);
router.get('/featured-quotes-text', featuredQuoteRoutes.listFeaturedQuotesTextRoute);
router.post('/featured-quotes', featuredQuoteRoutes.createFeaturedQuoteRoute);
router.put('/featured-quotes/:id', featuredQuoteRoutes.updateFeaturedQuoteRoute);

router.get('/files', listUploadedFilesRoute);
router.post('/files', uploadFileMiddleware, createUploadedFileRoute);

highlightCreateRoutes(router);
imageCreateRoutes(router);
placeCreateRoutes(router);
mapCreateRoutes(router);
miscCreateRoutes(router);
notationCreateRoutes(router);

personCreateRoutes(router);
router.post('/people', createPersonRoute);
router.get('/people/:id', getPersonRoute);
router.get('/people/:id/checklist', getPersonChecklistRoute);
router.get('/people/:id/photos', getPersonPhotosRoute);
router.get('/people/:id/timeline', getPersonTimelineRoute);

sourceCreateRoutes(router);
storyCreateRoutes(router);
tagCreateRoutes(router);
