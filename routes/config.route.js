import express from 'express';

import { exists } from '../controllers/config.controller.js';

const router = express.Router();

router.get('/exists', exists);

export default router;
