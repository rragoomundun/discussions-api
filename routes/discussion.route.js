import express from 'express';

import { createDiscussion } from '../controllers/discussion.controller.js';

import { createDiscussionValidator } from '../validators/discussion.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router.post('/', authorizeMiddleware, createDiscussionValidator, createDiscussion);

export default router;
