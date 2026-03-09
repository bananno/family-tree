import express from 'express';

import listEventsRoute from './listEvents.route.js';

// All routes are protected.
const router = express.Router();

router.get('/', listEventsRoute);

export default router;
