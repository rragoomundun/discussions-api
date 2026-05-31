import express from 'express';

import { getMessagesInDiscussion } from '../controllers/message.controller.js';
import { getMessagesInDiscussionValidator } from '../validators/message.validator.js';

const router = express.Router();

router.get('/all', getMessagesInDiscussionValidator, getMessagesInDiscussion);

export default router;
