import { query } from 'express-validator';

import validation from './validation.js';

const searchValidator = validation([
  query('query').notEmpty().withMessage('EMPTY'),
  query('page').optional().isInt().withMessage('INVALID')
]);

const searchMetaValidator = validation([query('query').notEmpty().withMessage('EMPTY')]);

export { searchValidator, searchMetaValidator };
