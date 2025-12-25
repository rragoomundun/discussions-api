import express from 'express';

import { exists } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/exists', exists);

export default router;
