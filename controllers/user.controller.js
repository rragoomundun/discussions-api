import httpStatus from 'http-status-codes';

import User from '../models/User.js';
import Discussion from '../models/Discussion.js';
import Message from '../models/Message.js';

import ErrorResponse from '../classes/ErrorResponse.js';

/**
 * @api {GET} /user Get User
 * @apiGroup User
 * @apiName UserGetUser
 *
 * @apiDescription Get the logged in user informations.
 *
 * @apiSuccess (Success (200)) {String} id The user id
 * @apiSuccess (Success (200)) {String} name The user name
 * @apiSuccess (Success (200)) {String} email The user email
 * @apiSuccess (Success (200)) {String} role The user role (admin, moderator, or regular)
 * @apiSuccess (Success (200)) {String} image The user profile picture
 * @apiSuccess (Success (200)) {String} birthday The user birth date (YYYY-MM-DD)
 * @apiSuccess (Success (200)) {String} biography The user biography
 * @apiSuccess (Success (200)) {String} location The user location
 * @apiSuccess (Success (200)) {String} gender The user gender
 * @apiSuccess (Success (200)) {String} signature The user signature
 * @apiSuccess (Success (200)) {Boolean} active Whether the user is active or no
 * @apiSuccess (Success (200)) {Date} createdAt The created date of the account
 *
 * @apiSuccessExample Success Example
 * {
 *   "id": 42,
 *   "name": "Tom Appolo",
 *   "email": "tom.appolo@ex.com",
 *   "role": "regular",
 *   "image": null,
 *   "birthday": null,
 *   "biography": "Lorem ipsum...",
 *   "location": "France",
 *   "gender": "male",
 *   "signature": "Lorem ipsum...",
 *   "active": true,
 *   "createdAt": "2025-12-30 11:11:11"
 * }
 *
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 *
 * @apiPermission Public
 */
const getUser = async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: [
      'id',
      'name',
      'email',
      'role',
      'image',
      'birthday',
      'biography',
      'location',
      'gender',
      'signature',
      'active',
      'createdAt'
    ]
  });

  res.status(httpStatus.OK).json({
    ...user.toJSON(),
    birthday: user.birthday ? user.birthday.toISOString().split('T')[0] : null
  });
};

/**
 * @api {GET} /user/:id Get User Profile
 * @apiGroup User
 * @apiName UserGetUserProfile
 *
 * @apiDescription Get the public profile information of a specific user.
 *
 * @apiParam {Number} id The user id.
 *
 * @apiSuccess (Success (200)) {String} name The user name
 * @apiSuccess (Success (200)) {String} role The user role (admin, moderator, or regular)
 * @apiSuccess (Success (200)) {Number} nbDiscussions The number of discussions started by the user
 * @apiSuccess (Success (200)) {Number} nbMessages The number of messages posted by the user
 * @apiSuccess (Success (200)) {Date} createdAt The created date of the account
 *
 * @apiSuccessExample Success Example
 * {
 *   "name": "Tom Appolo",
 *   "role": "regular",
 *   "nbDiscussions": 4,
 *   "nbMessages": 27,
 *   "createdAt": "2025-12-30T11:11:11.000Z"
 * }
 *
 * @apiError (Error (404)) NOT_FOUND The user does not exist
 *
 * @apiPermission Public
 */
const getUserProfile = async (req, res, next) => {
  const { id } = req.params;

  const [user, nbDiscussions, nbMessages] = await Promise.all([
    User.findOne({
      where: { id },
      attributes: ['name', 'role', 'createdAt']
    }),
    Discussion.count({ where: { userId: id } }),
    Message.count({ where: { authorId: id } })
  ]);

  if (!user) {
    return next(new ErrorResponse('User not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  res.status(httpStatus.OK).json({
    name: user.name,
    role: user.role,
    nbDiscussions,
    nbMessages,
    createdAt: user.createdAt
  });
};

/**
 * @api {PUT} /user/email Update Email
 * @apiGroup User
 * @apiName UserUpdateEmail
 *
 * @apiDescription Update the user email
 *
 * @apiBody {String} email The email.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "email": "tom.apollo@ex.com"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updateEmail = async (req, res, next) => {
  const { email } = req.body;

  await User.update({ email }, { where: { id: req.user.id } });

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /user/password Update Password
 * @apiGroup User
 * @apiName UserUpdatePassword
 *
 * @apiDescription Update the user password.
 *
 * @apiBody {String} password The password.
 * @apiBody {String} passwordConfirmation The password confirmation.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "password": "ophq31;H",
 *   "passwordConfirmation": "ophq31;H"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updatePassword = async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findOne({ where: { id: req.user.id } });

  user.password = password;

  await user.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /user/profile-picture Update Profile Picture
 * @apiGroup User
 * @apiName UserUpdateProfilePicture
 *
 * @apiDescription Update the user profile picture.
 *
 * @apiBody {String} path Profile picture path.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "path": "/uploads/user/31/132148963-picture.jpg"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updateProfilePicture = async (req, res, next) => {
  const { path } = req.body;
  const user = await User.findOne({ where: { id: req.user.id } });

  user.image = path;

  await user.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /user/personal-information Update Personal Information
 * @apiGroup User
 * @apiName UserUpdatePersonalInformation
 *
 * @apiDescription Update the user's personal information.
 *
 * @apiBody {Date} birthday The date of birth of the user.
 * @apiBody {String} biography The user's biography.
 * @apiBody {String} location The user's location
 * @apiBody {String="male,female"} gender The user's gender.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "birthday": "2026-01-05T10:57:04.822Z",
 *   "biography": "Lorem ipsum..."
 *   "location": "Mauritius"
 *   "gender": "male"
 * }
 *
 * @apiPermission Private
 */
const updatePersonalInformation = async (req, res, next) => {
  const { birthday, biography, location, gender } = req.body;
  const user = await User.findOne({ where: { id: req.user.id } });

  user.birthday = birthday;
  user.biography = biography;
  user.location = location;
  user.gender = gender;

  await user.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /user/signature Update Signature
 * @apiGroup User
 * @apiName UserUpdateSignature
 *
 * @apiDescription Update the user's signature.
 *
 * @apiBody {String} signature The user's signature
 *
 * @apiParamExample {json} Body Example
 * {
 *   "signature": "Lorem ipsum..."
 * }
 *
 * @apiPermission Private
 */
const updateSignature = async (req, res, next) => {
  const { signature } = req.body;
  const user = await User.findOne({ where: { id: req.user.id } });

  user.signature = signature;

  await user.save();

  res.status(httpStatus.OK).end();
};

export {
  getUser,
  getUserProfile,
  updateEmail,
  updatePassword,
  updateProfilePicture,
  updatePersonalInformation,
  updateSignature
};
