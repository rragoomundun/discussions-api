import { query, body } from 'express-validator';

import validation from './validation.js';

import Discussion from '../models/Discussion.js';

const getMessagesInDiscussionValidator = validation([
  query('discussionId').notEmpty().withMessage('EMPTY').isInt().withMessage('INVALID')
]);

const postMessageValidator = validation([
  body('message').notEmpty().withMessage('EMPTY'),
  body('discussionId')
    .notEmpty()
    .withMessage('EMPTY')
    .isInt()
    .withMessage('INVALID')
    .custom(async (value) => {
      const discussion = await Discussion.findOne({ where: { id: value } });

      if (!discussion) {
        throw new Error('NOT_FOUND');
      }
    })
]);

const updateMessageValidator = validation([
  body('message').notEmpty().withMessage('EMPTY')
]);

export { getMessagesInDiscussionValidator, postMessageValidator, updateMessageValidator };
