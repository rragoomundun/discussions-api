import express from 'express';

import { exists, get, init } from '../controllers/config.controller.js';

import { initValidator } from '../validators/config.validator.js';

const router = express.Router();

router.get('/exists', exists).post('/init', initValidator, init).get('/', get);

export default router;
