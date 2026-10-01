import express from 'express';

import {
  createDiscussion,
  updateDiscussion,
  getDiscussion,
  deleteDiscussion,
  getDiscussionsInForum,
  setDiscussionOpen,
  setDiscussionPinned,
  moveDiscussion
} from '../controllers/discussion.controller.js';

import {
  createDiscussionValidator,
  updateDiscussionValidator,
  getDiscussionsInForumValidator,
  setDiscussionOpenValidator,
  setDiscussionPinnedValidator,
  moveDiscussionValidator
} from '../validators/discussion.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import activeUserMiddleware from '../middlewares/activeUser.middleware.js';
import authorizeModeratorAdminMiddleware from '../middlewares/authorizeModeratorAdmin.middleware.js';

const router = express.Router();

router
  .get('/all', getDiscussionsInForumValidator, getDiscussionsInForum)
  .get('/:discussionId', getDiscussion)
  .post('/', authorizeMiddleware, activeUserMiddleware, createDiscussionValidator, createDiscussion)
  .put('/:discussionId', authorizeMiddleware, activeUserMiddleware, updateDiscussionValidator, updateDiscussion)
  .delete('/:discussionId', authorizeMiddleware, activeUserMiddleware, deleteDiscussion)
  .put('/:discussionId/open', authorizeMiddleware, setDiscussionOpenValidator, setDiscussionOpen)
  .put(
    '/:discussionId/pinned',
    authorizeMiddleware,
    authorizeModeratorAdminMiddleware,
    setDiscussionPinnedValidator,
    setDiscussionPinned
  )
  .put(
    '/:discussionId/move',
    authorizeMiddleware,
    authorizeModeratorAdminMiddleware,
    moveDiscussionValidator,
    moveDiscussion
  );

export default router;
