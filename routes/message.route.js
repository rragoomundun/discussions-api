import express from 'express';

import { getMessagesInDiscussion, postMessage } from '../controllers/message.controller.js';
import { getMessagesInDiscussionValidator, postMessageValidator } from '../validators/message.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .get('/all', getMessagesInDiscussionValidator, getMessagesInDiscussion)
  .post('/', authorizeMiddleware, postMessageValidator, postMessage);

export default router;
