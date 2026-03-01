import express from 'express';

import causeOfDeathTopicRoute from './causeOfDeathTopic.route.js';

const router = express.Router();

// public routes
router.get('/cause-of-death', causeOfDeathTopicRoute);

export default router;
