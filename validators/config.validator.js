import { body } from 'express-validator';

import validation from './validation.js';

const initValidator = validation([
  body('title').notEmpty().withMessage('EMPTY'),
  body('lang').notEmpty().withMessage('EMPTY').isIn(['en', 'fr']).withMessage('INVALID_LANG')
]);

const updateValidator = validation([
  body('title').notEmpty().withMessage('EMPTY'),
  body('lang').notEmpty().withMessage('EMPTY').isIn(['en', 'fr']).withMessage('INVALID_LANG'),
  body('show_title').notEmpty().withMessage('EMPTY'),
  body('show_logo').notEmpty().withMessage('EMPTY')
]);

export { initValidator, updateValidator };
