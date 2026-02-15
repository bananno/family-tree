import express from 'express';

import uploadFileMiddleware from '../file/uploadFileMiddleware.js';

import requireAdmin from '../session/requireAdmin.js';

import listPeopleRoute from './listPeople.route.js';
import createPersonRoute from './createPerson.route.js';
import getPersonRoute from './getPerson.route.js';
import getPersonChecklistRoute from './getPersonChecklist.route.js';
import getPersonPhotosRoute from './getPersonPhotos.route.js';
import getPersonTimelineRoute from './getPersonTimeline.route.js';
import updatePersonRoute from './updatePerson.route.js';
import updatePersonLinksRoute from './updatePersonLinks.route.js';

import createPersonAvatarRoute from './avatar/createPersonAvatar.route.js';
import deletePersonAvatarRoute from './avatar/deletePersonAvatar.route.js';
import getPersonAvatarsRoute from './avatar/getPersonAvatars.route.js';
import updatePersonAvatarRoute from './avatar/updatePersonAvatar.route.js';

const router = express.Router();

// public routes
router.get('/', listPeopleRoute);
router.get('/:id', getPersonRoute);
router.get('/:id/photos', getPersonPhotosRoute);
router.get('/:id/timeline', getPersonTimelineRoute);

router.use(requireAdmin);

// protected routes
router.post('/', createPersonRoute);
router.get('/:id/checklist', getPersonChecklistRoute);
router.post('/:id', updatePersonRoute);
router.post('/:id/links', updatePersonLinksRoute);
router.post('/:id/avatars', uploadFileMiddleware, createPersonAvatarRoute);
router.delete('/:id/avatars/:avatarId', deletePersonAvatarRoute);
router.get('/:id/avatars', getPersonAvatarsRoute);
router.patch('/:id/avatars', updatePersonAvatarRoute);

export default router;
