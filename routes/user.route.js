import express from 'express';

import { getUser, updateEmail, updatePassword } from '../controllers/user.controller.js';

import { emailValidator, passwordValidator } from '../validators/user.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .get('/', authorizeMiddleware, getUser)
  .put('/email', authorizeMiddleware, emailValidator, updateEmail)
  .put('/password', authorizeMiddleware, passwordValidator, updatePassword);

export default router;
