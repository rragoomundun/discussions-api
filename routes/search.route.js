import express from 'express';

import { search } from '../controllers/search.controller.js';

import { searchValidator } from '../validators/search.validator.js';

const router = express.Router();

router.get('/', searchValidator, search);

export default router;
