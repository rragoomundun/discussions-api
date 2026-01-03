import express from 'express';

import { deleteFile, uploadFile } from '../controllers/file.controller.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import uploadMiddleware from '../middlewares/upload.middleware.js';

import { uploadFileValidator } from '../validators/file.validator.js';

const router = express.Router();

router
  .post('/', authorizeMiddleware, uploadMiddleware.single('file'), uploadFileValidator, uploadFile)
  .delete('/', authorizeMiddleware, deleteFile);

export default router;
