import express from 'express';

import { isNew } from '../controllers/site.controller.js';

const router = express.Router();

router.get('/is-new', isNew);

export default router;
