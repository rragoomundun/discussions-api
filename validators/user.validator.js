import { body } from 'express-validator';

import validation from './validation.js';

import User from '../models/User.js';

const emailValidator = validation([
  body('email')
    .notEmpty()
    .withMessage('EMPTY')
    .isEmail()
    .withMessage('INVALID_EMAIL')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } });

      if (user && user.id !== req.user.id) {
        throw new Error('EMAIL_IN_USE');
      }
    })
]);

export { emailValidator };
