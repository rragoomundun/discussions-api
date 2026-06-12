import express from 'express';

import {
  isFirstMessage,
  getMessage,
  getMessagesInDiscussion,
  postMessage,
  updateMessage,
  deleteMessage
} from '../controllers/message.controller.js';
import {
  getMessagesInDiscussionValidator,
  postMessageValidator,
  updateMessageValidator
} from '../validators/message.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .get('/all', getMessagesInDiscussionValidator, getMessagesInDiscussion)
  .get('/:messageId', getMessage)
  .get('/:messageId/is-first', isFirstMessage)
  .post('/', authorizeMiddleware, postMessageValidator, postMessage)
  .put('/:messageId', authorizeMiddleware, updateMessageValidator, updateMessage)
  .delete('/:messageId', authorizeMiddleware, deleteMessage);

export default router;
