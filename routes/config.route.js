import express from 'express';

import { exists, get, init, update, updateBottomLinks } from '../controllers/config.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import authorizeAdminMiddleware from '../middlewares/authorizeAdmin.middleware.js';

import { initValidator, updateValidator } from '../validators/config.validator.js';

const router = express.Router();

router
  .get('/exists', exists)
  .post('/init', initValidator, init)
  .get('/', get)
  .put('/', authorizeMiddleware, authorizeAdminMiddleware, updateValidator, update)
  .put('/bottom-links', authorizeMiddleware, authorizeAdminMiddleware, updateBottomLinks);

export default router;
