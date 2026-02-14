import express from 'express';

import listCitationsRoute from './listCitations.route.js';

const router = express.Router();

router.get('/', listCitationsRoute);

export default router;
