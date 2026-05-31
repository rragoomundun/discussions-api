import express from 'express';

import { createDiscussion, updateDiscussion, getDiscussion, deleteDiscussion, getDiscussionsInForum } from '../controllers/discussion.controller.js';

import { createDiscussionValidator, updateDiscussionValidator, getDiscussionsInForumValidator } from '../validators/discussion.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .get('/all', getDiscussionsInForumValidator, getDiscussionsInForum)
  .get('/:discussionId', getDiscussion)
  .post('/', authorizeMiddleware, createDiscussionValidator, createDiscussion)
  .put('/:discussionId', authorizeMiddleware, updateDiscussionValidator, updateDiscussion)
  .delete('/:discussionId', authorizeMiddleware, deleteDiscussion);

export default router;
