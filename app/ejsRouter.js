import express from 'express';

import * as routerTools from './tools/routerTools.js';

import checklistCreateRoutes from './checklist/index.js';
import citationCreateRoutes from './citation/index.js';

// Event
import eventCreateRoutes from './event/index.js';
import listEventsRoute from './event/listEvents.route.js';

import exportFullDataRoute from './export/exportFullData.route.js';
import exportPublishedDataRoute from './export/exportPublishedData.route.js';
import {
  uploadFileMiddleware,
  createUploadedFileRoute,
  listUploadedFilesRoute,
} from './file/uploadedFileRoutes.js';
import highlightCreateRoutes from './highlight/index.js';
import imageCreateRoutes from './image/index.js';
import placeCreateRoutes from './place/index.js';
import mapCreateRoutes from './map/index.js';
import miscCreateRoutes from './misc/index.js';
import notationCreateRoutes from './notation/index.js';
import personCreateRoutes from './person/index.js';
import sourceCreateRoutes from './source/index.js';
import storyCreateRoutes from './story/index.js';
import tagCreateRoutes from './tag/index.js';

const router = express.Router();

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

router.get('/', (req, res) => {
  res.render('index', { title: null });
});

checklistCreateRoutes(router);
citationCreateRoutes(router);

eventCreateRoutes(router);
router.get('/api/events', listEventsRoute);

router.get('/export/full', exportFullDataRoute);
router.get('/export/publish', exportPublishedDataRoute);

router.get('/files', listUploadedFilesRoute);
router.post('/files', uploadFileMiddleware, createUploadedFileRoute);

highlightCreateRoutes(router);
imageCreateRoutes(router);
placeCreateRoutes(router);
mapCreateRoutes(router);
miscCreateRoutes(router);
notationCreateRoutes(router);
personCreateRoutes(router);
sourceCreateRoutes(router);
storyCreateRoutes(router);
tagCreateRoutes(router);

export default router;
