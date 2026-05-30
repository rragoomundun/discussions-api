import { body } from 'express-validator';

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

export { createDiscussionValidator };
