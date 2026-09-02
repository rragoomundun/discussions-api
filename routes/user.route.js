import express from 'express';

import {
  getUser,
  getUserProfile,
  getUserInformation,
  getUserDiscussions,
  getUserMessages,
  updateEmail,
  updatePassword,
  updatePersonalInformation,
  updateProfilePicture,
  updateSignature
} from '../controllers/user.controller.js';

import { emailValidator, passwordValidator, profilePictureValidator } from '../validators/user.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .get('/', authorizeMiddleware, getUser)
  .get('/:id', getUserProfile)
  .get('/:id/informations', getUserInformation)
  .get('/:id/discussions', getUserDiscussions)
  .get('/:id/messages', getUserMessages)
  .put('/email', authorizeMiddleware, emailValidator, updateEmail)
  .put('/password', authorizeMiddleware, passwordValidator, updatePassword)
  .put('/profile-picture', authorizeMiddleware, profilePictureValidator, updateProfilePicture)
  .put('/personal-information', authorizeMiddleware, updatePersonalInformation)
  .put('/signature', authorizeMiddleware, updateSignature);

export default router;
