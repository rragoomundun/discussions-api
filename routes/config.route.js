import express from 'express';

import {
  exists,
  get,
  getWarningLimit,
  init,
  update,
  updateWarningLimit,
  updateBottomLinks
} from '../controllers/config.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import authorizeAdminMiddleware from '../middlewares/authorizeAdmin.middleware.js';

import { initValidator, updateValidator, updateWarningLimitValidator } from '../validators/config.validator.js';

const router = express.Router();

router
  .get('/exists', exists)
  .post('/init', initValidator, init)
  .get('/', get)
  .get('/warning-limit', getWarningLimit)
  .put('/', authorizeMiddleware, authorizeAdminMiddleware, updateValidator, update)
  .put('/warning-limit', authorizeMiddleware, authorizeAdminMiddleware, updateWarningLimitValidator, updateWarningLimit)
  .put('/bottom-links', authorizeMiddleware, authorizeAdminMiddleware, updateBottomLinks);

export default router;
