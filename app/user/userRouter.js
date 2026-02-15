import _ from 'lodash';
import express from 'express';

import listUsersRoute from './listUsers.route.js';
import createUserRoute from './createUser.route.js';
import updateUserRoute from './updateUser.route.js';

// All routes are protected.
const router = express.Router();

router.get('/', listUsersRoute);
router.post('/', createUserRoute);
router.post('/:id/update', updateUserRoute);

export default router;
