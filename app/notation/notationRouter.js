import _ from 'lodash';
import express from 'express';

import getNotationRoute from './getNotation.route.js';
import listNotationsRoute from './listNotations.route.js';

// All routes are protected.
const router = express.Router();

router.get('/', listNotationsRoute);
router.get('/:id', getNotationRoute);

export default router;
