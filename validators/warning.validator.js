import { query, body } from 'express-validator';

import validation from './validation.js';

const getWarningsValidator = validation([
  query('userId').notEmpty().withMessage('EMPTY').isInt().withMessage('INVALID')
]);

const createWarningValidator = validation([
  body('userId').notEmpty().withMessage('EMPTY').isInt().withMessage('INVALID')
]);

export { getWarningsValidator, createWarningValidator };
