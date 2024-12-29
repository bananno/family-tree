import express from 'express';

import * as routerTools from './tools/routerTools.js';
import resources from './resources.js';
import {
  uploadImageMiddleware,
  uploadImageRoute,
} from './image/uploadImage.route.js';

import apiCreateRoutes from './api/index.js';
import checklistCreateRoutes from './checklist/index.js';
import citationCreateRoutes from './citation/index.js';
import eventCreateRoutes from './event/index.js';
import exportCreateRoutes from './export/index.js';
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
    if (view === 'layout') { // phase out
      return res.renderOriginal(view, options);
    }
    return res.renderOriginal('layout', {view, ...options});
  };

  req.getFormDataDate = () => routerTools.getFormDataDate(req);
  req.getFormDataLocation = () => routerTools.getFormDataLocation(req);
  req.getFormDataTags = () => routerTools.getFormDataTags(req);

  next();
});

// HOME

router.get('/', (req, res) => {
  res.render('index', {title: null});
});

apiCreateRoutes(router);
checklistCreateRoutes(router);
citationCreateRoutes(router);
eventCreateRoutes(router);
exportCreateRoutes(router);
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

// MISC

router.post('/image/upload', uploadImageMiddleware, uploadImageRoute);

export default router;
