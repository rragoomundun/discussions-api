import express from 'express';

import {
  register,
  registerConfirm,
  login,
  logout,
  forgotPassword,
  authorized
} from '../controllers/auth.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

import { registerValidator, loginValidator, forgotPasswordValidator } from '../validators/auth.validator.js';

const router = express.Router();

router
  .post('/register', registerValidator, register)
  .post('/register/confirm/:confirmationToken', registerConfirm)
  .post('/login', loginValidator, login)
  .get('/logout', logout)
  .post('/password/forgot', forgotPasswordValidator, forgotPassword)
  .get('/authorized', authorizeMiddleware, authorized);

export default router;
