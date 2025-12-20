import express from 'express';

import { getStatus, test } from '../controllers/api.controller.js';

const router = express.Router();

router.get('/status', getStatus).post('/test/:param', test);

export default router;
