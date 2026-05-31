import express from 'express';

import { getMessagesInDiscussion, postMessage, updateMessage, deleteMessage } from '../controllers/message.controller.js';
import { getMessagesInDiscussionValidator, postMessageValidator, updateMessageValidator } from '../validators/message.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .get('/all', getMessagesInDiscussionValidator, getMessagesInDiscussion)
  .post('/', authorizeMiddleware, postMessageValidator, postMessage)
  .put('/:messageId', authorizeMiddleware, updateMessageValidator, updateMessage)
  .delete('/:messageId', authorizeMiddleware, deleteMessage);

export default router;
