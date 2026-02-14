import express from 'express';

import * as routerTools from './tools/routerTools.js';

import citationRouter from './citation/citationRouter.js';
import personRouter from './person/personRouter.js';
import requireAdmin from './session/requireAdmin.js';
import sessionRouter from './session/sessionRouter.js';
import sourceRouter from './source/sourceRouter.js';
import storyRouter from './story/storyRouter.js';

import apiCreateRoutes from './api/index.js';
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
import * as featuredQuoteRoutes from './misc/featuredQuoteRoutes.js';
import highlightCreateRoutes from './highlight/index.js';
import imageCreateRoutes from './image/index.js';
import placeCreateRoutes from './place/index.js';
import mapCreateRoutes from './map/index.js';
import miscCreateRoutes from './misc/index.js';
import notationCreateRoutes from './notation/index.js';

// Notation
import listNotationsRoute from './notation/listNotations.route.js';

import personCreateRoutes from './person/index.js';
import sourceCreateRoutes from './source/index.js';
import storyCreateRoutes from './story/index.js';

// Tag
import tagCreateRoutes from './tag/index.js';
import createTagRoute from './tag/createTag.route.js';
import getTagRoute from './tag/getTag.route.js';
import deleteTagRoute from './tag/deleteTag.route.js';
import listTagsRoute from './tag/listTags.route.js';
import updateTagRoute from './tag/updateTag.route.js';
import updateTagAttachmentsRoute from './tag/updateTagAttachments.route.js';

// User
import listUsersRoute from './user/listUsers.route.js';
import createUserRoute from './user/createUser.route.js';
import updateUserRoute from './user/updateUser.route.js';

const router = express.Router();
const router2 = express.Router();

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
router.get('/api/events', listEventsRoute);

router.get('/export/full', exportFullDataRoute);
router.get('/export/publish', exportPublishedDataRoute);

router.get('/featured-quotes', featuredQuoteRoutes.listFeaturedQuotesRoute);
router2.get(
  '/featured-quotes-text',
  featuredQuoteRoutes.listFeaturedQuotesTextRoute,
);
router.post('/featured-quotes', featuredQuoteRoutes.createFeaturedQuoteRoute);
router.put(
  '/featured-quotes/:id',
  featuredQuoteRoutes.updateFeaturedQuoteRoute,
);

router.get('/files', listUploadedFilesRoute);
router.post('/files', uploadFileMiddleware, createUploadedFileRoute);

highlightCreateRoutes(router);
imageCreateRoutes(router);
placeCreateRoutes(router);
mapCreateRoutes(router);
miscCreateRoutes(router);

notationCreateRoutes(router);
router.get('/api/notations', listNotationsRoute);

personCreateRoutes(router);
sourceCreateRoutes(router);
storyCreateRoutes(router);

tagCreateRoutes(router);
router.get('/tags', listTagsRoute);
router.get('/tags/:id', getTagRoute);
router.delete('/tags/:id', deleteTagRoute);
router.post('/tags', createTagRoute);
router.post('/tags/:id', updateTagRoute);
router.post('/tag-attachments', updateTagAttachmentsRoute);

router.get('/users', listUsersRoute);
router.post('/users', createUserRoute);
router.post('/users/:id/update', updateUserRoute);

export default function registerRouters(app) {
  app.use('/session', sessionRouter);

  app.use('/citations', citationRouter);
  app.use('/people', personRouter);
  app.use('/sources', sourceRouter);
  app.use('/stories', storyRouter);

  app.use('/', router2);
  app.use('/', requireAdmin, router);
}
