import { body } from 'express-validator';

import User from '../models/User.js';

import validation from './validation.js';

const registerValidator = validation([
  body('name')
    .notEmpty()
    .withMessage('EMPTY')
    .custom(async (value) => {
      value = value.trim();

      if (value === 0) {
        throw new Error('EMPTY');
      }

      // const nameExists = await User.findOne({ where: { name: value } });

      // if (nameExists) {
      //   throw new Error('NAME_IN_USE');
      // }
    }),
  body('email')
    .notEmpty()
    .withMessage('EMPTY')
    .isEmail()
    .withMessage('NOT_EMAIL')
    .custom(async (value) => {
      // const emailExists = await User.findOne({ where: { email: value } });
      // if (emailExists) {
      //   throw new Error('EMAIL_IN_USE');
      // }
    }),
  body('password')
    .notEmpty()
    .withMessage('EMPTY')
    .isLength({ min: 8 })
    .withMessage('PASSWORD_MIN_LENGTH_8')
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

export { registerValidator };
