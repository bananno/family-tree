import _ from 'lodash';
import express from 'express';

import createTagRoute from './createTag.route.js';
import getTagRoute from './getTag.route.js';
import deleteTagRoute from './deleteTag.route.js';
import listTagsRoute from './listTags.route.js';
import updateTagRoute from './updateTag.route.js';
import updateTagAttachmentsRoute from './updateTagAttachments.route.js';

// All routes are protected.
const router = express.Router();

router.get('/', listTagsRoute);
router.get('/:id', getTagRoute);
router.delete('/:id', deleteTagRoute);
router.post('', createTagRoute);
router.post('/tag-attachments', updateTagAttachmentsRoute); // must be before /:id
router.post('/:id', updateTagRoute);

export default router;
