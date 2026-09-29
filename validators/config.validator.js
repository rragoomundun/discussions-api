import { body } from 'express-validator';

import validation from './validation.js';

const initValidator = validation([
  body('title').notEmpty().withMessage('EMPTY'),
  body('lang').notEmpty().withMessage('EMPTY').isIn(['en', 'fr']).withMessage('INVALID_LANG')
]);

const updateValidator = validation([
  body('title').notEmpty().withMessage('EMPTY'),
  body('lang').notEmpty().withMessage('EMPTY').isIn(['en', 'fr']).withMessage('INVALID_LANG'),
  body('showTitle').notEmpty().withMessage('EMPTY'),
  body('showLogo').notEmpty().withMessage('EMPTY')
]);

const updateWarningLimitValidator = validation([
  body('limit').notEmpty().withMessage('EMPTY').isInt({ min: 5 }).withMessage('INVALID')
]);

export { initValidator, updateValidator, updateWarningLimitValidator };
