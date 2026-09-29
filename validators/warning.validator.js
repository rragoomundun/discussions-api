import { body } from 'express-validator';

import validation from './validation.js';

const createWarningValidator = validation([
  body('userId').notEmpty().withMessage('EMPTY').isInt().withMessage('INVALID')
]);

export { createWarningValidator };
