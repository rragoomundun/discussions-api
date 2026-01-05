import express from 'express';

import { getUser, updateEmail } from '../controllers/user.controller.js';

import { emailValidator } from '../validators/user.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router.get('/', authorizeMiddleware, getUser).put('/email', authorizeMiddleware, emailValidator, updateEmail);

export default router;
