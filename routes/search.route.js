import express from 'express';

import { search, getSearchMeta } from '../controllers/search.controller.js';

import { searchValidator, searchMetaValidator } from '../validators/search.validator.js';

const router = express.Router();

router.get('/meta', searchMetaValidator, getSearchMeta).get('/', searchValidator, search);

export default router;
