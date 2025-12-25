import express from 'express';

import { register, registerConfirm, login, logout, authorized } from '../controllers/auth.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const router = express.Router();

router
  .post('/register', registerValidator, register)
  .post('/register/confirm/:confirmationToken', registerConfirm)
  .post('/login', loginValidator, login)
  .get('/logout', logout)
  .get('/authorized', authorizeMiddleware, authorized);

export default router;
