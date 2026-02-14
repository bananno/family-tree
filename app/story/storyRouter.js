import express from 'express';

import requireAdmin from '../session/requireAdmin.js';

import createStoryRoute from './createStory.route.js';
import getStoryRoute from './getStory.route.js';
import listStoriesRoute from './listStories.route.js';
import listStoriesNonEntrySourcesRoute from './listStoriesNonEntrySources.route.js';

const router = express.Router();

// public routes
router.get('/', listStoriesRoute);
router.get('/:id', getStoryRoute);

router.use(requireAdmin);

// protected routes
router.get('/special/non-entry-sources', listStoriesNonEntrySourcesRoute);
router.post('/', createStoryRoute);

export default router;
