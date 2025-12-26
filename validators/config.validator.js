import { body } from 'express-validator';

import Config from '../models/Config.js';

import validation from './validation.js';

const initValidator = validation([
  body('title').notEmpty().withMessage('EMPTY'),
  body('lang').notEmpty().withMessage('EMPTY').isIn(['en', 'fr']).withMessage('INVALID_LANG')
]);

export { initValidator };
