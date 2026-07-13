import express from 'express';

import listObjectsRoute from './listObjects.route.js';
import getObjectRoute from './getObject.route.js';
import createObjectRoute from './createObject.route.js';
import updateObjectRoute from './updateObject.route.js';
import deleteObjectRoute from './deleteObject.route.js';

// All routes are protected.
const router = express.Router();

router.get('/', listObjectsRoute);
router.get('/:id', getObjectRoute);
router.post('/', createObjectRoute);
router.post('/:id/update', updateObjectRoute);
router.delete('/:id', deleteObjectRoute);

export default router;
