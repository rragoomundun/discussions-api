import { query } from 'express-validator';

import validation from './validation.js';

const getMessagesInDiscussionValidator = validation([
  query('discussionId').notEmpty().withMessage('EMPTY').isInt().withMessage('INVALID')
]);

export { getMessagesInDiscussionValidator };
