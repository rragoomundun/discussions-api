import { body, query } from 'express-validator';

import validation from './validation.js';

import Forum from '../models/Forum.js';

const createDiscussionValidator = validation([
  body('title').notEmpty().withMessage('EMPTY'),
  body('forumId')
    .notEmpty()
    .withMessage('EMPTY')
    .isInt()
    .withMessage('INVALID')
    .custom(async (value) => {
      const forum = await Forum.findOne({ where: { id: value } });

      if (!forum) {
        throw new Error('NOT_FOUND');
      }
    })
]);

const updateDiscussionValidator = validation([
  body('title').notEmpty().withMessage('EMPTY')
]);

const getDiscussionsInForumValidator = validation([
  query('forumId').notEmpty().withMessage('EMPTY').isInt().withMessage('INVALID')
]);

const setDiscussionOpenValidator = validation([
  body('open').notEmpty().withMessage('EMPTY').isBoolean().withMessage('INVALID')
]);

const getDiscussionPagesValidator = validation([
  query('forumId').notEmpty().withMessage('EMPTY').isInt().withMessage('INVALID')
]);

export { createDiscussionValidator, updateDiscussionValidator, getDiscussionsInForumValidator, setDiscussionOpenValidator, getDiscussionPagesValidator };
