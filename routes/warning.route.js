import express from 'express';

import { createWarning, deleteWarning } from '../controllers/warning.controller.js';
import { createWarningValidator } from '../validators/warning.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import authorizeModeratorAdminMiddleware from '../middlewares/authorizeModeratorAdmin.middleware.js';

const router = express.Router();

router
  .post('/', authorizeMiddleware, createWarningValidator, createWarning)
  .delete('/:warningId', authorizeMiddleware, authorizeModeratorAdminMiddleware, deleteWarning);

export default router;
