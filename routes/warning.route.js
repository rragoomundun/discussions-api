import express from 'express';

import { createWarning } from '../controllers/warning.controller.js';
import { createWarningValidator } from '../validators/warning.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router.post('/', authorizeMiddleware, createWarningValidator, createWarning);

export default router;
