import express from 'express';

import {
  getUser,
  getUserProfile,
  getUserInformation,
  getUserDiscussions,
  getUserDiscussionsMeta,
  getUserMessages,
  getUserMessagesMeta,
  updateEmail,
  updatePassword,
  updatePersonalInformation,
  updateProfilePicture,
  updateSignature,
  setActiveStatus,
  setRole
} from '../controllers/user.controller.js';

import {
  emailValidator,
  passwordValidator,
  profilePictureValidator,
  activeValidator,
  roleValidator
} from '../validators/user.validator.js';

import authorizeMiddleware from '../middlewares/authorize.middleware.js';
import authorizeAdminMiddleware from '../middlewares/authorizeAdmin.middleware.js';
import authorizeModeratorAdminMiddleware from '../middlewares/authorizeModeratorAdmin.middleware.js';

const router = express.Router();

router
  .get('/', authorizeMiddleware, getUser)
  .get('/:id', getUserProfile)
  .get('/:id/informations', getUserInformation)
  .get('/:id/discussions', getUserDiscussions)
  .get('/:id/discussions/meta', getUserDiscussionsMeta)
  .get('/:id/messages', getUserMessages)
  .get('/:id/messages/meta', getUserMessagesMeta)
  .put('/email', authorizeMiddleware, emailValidator, updateEmail)
  .put('/password', authorizeMiddleware, passwordValidator, updatePassword)
  .put('/profile-picture', authorizeMiddleware, profilePictureValidator, updateProfilePicture)
  .put('/personal-information', authorizeMiddleware, updatePersonalInformation)
  .put('/signature', authorizeMiddleware, updateSignature)
  .put('/:userId/active', authorizeMiddleware, authorizeModeratorAdminMiddleware, activeValidator, setActiveStatus)
  .put('/:userId/role', authorizeMiddleware, authorizeAdminMiddleware, roleValidator, setRole);

export default router;
