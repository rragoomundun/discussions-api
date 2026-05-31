import express from 'express';

import { getMessagesInDiscussion, postMessage, updateMessage } from '../controllers/message.controller.js';
import { getMessagesInDiscussionValidator, postMessageValidator, updateMessageValidator } from '../validators/message.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .get('/all', getMessagesInDiscussionValidator, getMessagesInDiscussion)
  .post('/', authorizeMiddleware, postMessageValidator, postMessage)
  .put('/:messageId', authorizeMiddleware, updateMessageValidator, updateMessage);

export default router;
