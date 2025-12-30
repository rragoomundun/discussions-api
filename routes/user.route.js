import express from 'express';

import { getUser } from '../controllers/user.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router.get('/', authorizeMiddleware, getUser);

export default router;
