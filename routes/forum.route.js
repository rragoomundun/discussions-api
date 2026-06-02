import express from 'express';

import { getForum, updateForum, getForumMeta } from '../controllers/forum.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import authorizeAdminMiddleware from '../middlewares/authorizeAdmin.middleware.js';

const router = express.Router();

router
  .get('/', getForum)
  .get('/:forumId/meta', getForumMeta)
  .put('/', authorizeMiddleware, authorizeAdminMiddleware, updateForum);

export default router;
