import express from 'express';

import requireAdmin from '../session/requireAdmin.js';

import createSourceRoute from './createSource.route.js';
import listSourcesRoute from './listSources.route.js';

const router = express.Router();

// public routes
router.get('/', listSourcesRoute);
router.get('/:sourceType', listSourcesRoute);

router.use(requireAdmin);

// protected routes
router.post('/', createSourceRoute);

export default router;
