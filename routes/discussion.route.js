import express from 'express';

import { createDiscussion, updateDiscussion } from '../controllers/discussion.controller.js';

import { createDiscussionValidator, updateDiscussionValidator } from '../validators/discussion.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .post('/', authorizeMiddleware, createDiscussionValidator, createDiscussion)
  .put('/:discussionId', authorizeMiddleware, updateDiscussionValidator, updateDiscussion);

export default router;
