import express from 'express';

import {
  getUser,
  updateEmail,
  updatePassword,
  updatePersonalInformation,
  updateProfilePicture
} from '../controllers/user.controller.js';

import { emailValidator, passwordValidator, profilePictureValidator } from '../validators/user.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';

const router = express.Router();

router
  .get('/', authorizeMiddleware, getUser)
  .put('/email', authorizeMiddleware, emailValidator, updateEmail)
  .put('/password', authorizeMiddleware, passwordValidator, updatePassword)
  .put('/profile-picture', authorizeMiddleware, profilePictureValidator, updateProfilePicture)
  .put('/personal-information', authorizeMiddleware, updatePersonalInformation);

export default router;
