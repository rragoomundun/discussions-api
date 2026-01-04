import express from 'express';

import { updateForum } from '../controllers/forum.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import authorizeAdminMiddleware from '../middlewares/authorizeAdmin.middleware.js';

const router = express.Router();

router.put('/', authorizeMiddleware, authorizeAdminMiddleware, updateForum);

export default router;
