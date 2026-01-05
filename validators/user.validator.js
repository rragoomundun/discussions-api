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

const passwordValidator = validation([
  body('password')
    .notEmpty()
    .withMessage('EMPTY')
    .isLength({ min: 8 })
    .withMessage('PASSWORD_MIN_LENGTH')
    .isStrongPassword()
    .withMessage('PASSWORD_NOT_STRONG'),
  body('passwordConfirmation')
    .notEmpty()
    .withMessage('EMPTY')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('PASSWORD_CONFIRMATION_NO_MATCH');
      }

      return true;
    })
]);

const profilePictureValidator = validation([body('path').notEmpty().withMessage('EMPTY')]);

export { emailValidator, passwordValidator, profilePictureValidator };
