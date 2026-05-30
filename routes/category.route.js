import express from 'express';

import { getForumInCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/:categoryId/forum', getForumInCategory);

export default router;
