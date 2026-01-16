import express from 'express';

import { getForum, updateForum } from '../controllers/forum.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import authorizeAdminMiddleware from '../middlewares/authorizeAdmin.middleware.js';

const router = express.Router();

router.get('/', getForum).put('/', authorizeMiddleware, authorizeAdminMiddleware, updateForum);

export default router;
