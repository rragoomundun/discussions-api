import express from 'express';

import {
  register,
  registerConfirm,
  login,
  logout,
  forgotPassword,
  resetPassword,
  authorized
} from '../controllers/auth.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} from '../validators/auth.validator.js';

const router = express.Router();

router
  .post('/register', registerValidator, register)
  .post('/register/confirm/:confirmationToken', registerConfirm)
  .post('/login', loginValidator, login)
  .get('/logout', logout)
  .post('/password/forgot', forgotPasswordValidator, forgotPassword)
  .put('/password/reset/:resetPasswordToken', resetPasswordValidator, resetPassword)
  .get('/authorized', authorizeMiddleware, authorized);

export default router;
