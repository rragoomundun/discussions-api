import express from 'express';

import {
  getFirstMessage,
  getMessage,
  getMessagesInDiscussion,
  postMessage,
  updateMessage,
  deleteMessage
} from '../controllers/message.controller.js';
import {
  getFirstMessageValidator,
  getMessagesInDiscussionValidator,
  postMessageValidator,
  updateMessageValidator
} from '../validators/message.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import activeUserMiddleware from '../middlewares/activeUser.middleware.js';

const router = express.Router();

router
  .get('/all', getMessagesInDiscussionValidator, getMessagesInDiscussion)
  .get('/first', getFirstMessageValidator, getFirstMessage)
  .get('/:messageId', getMessage)
  .post('/', authorizeMiddleware, activeUserMiddleware, postMessageValidator, postMessage)
  .put('/:messageId', authorizeMiddleware, activeUserMiddleware, updateMessageValidator, updateMessage)
  .delete('/:messageId', authorizeMiddleware, activeUserMiddleware, deleteMessage);

export default router;
