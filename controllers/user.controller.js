import httpStatus from 'http-status-codes';

import User from '../models/User.js';

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
 * @apiSuccess (Success (200)) {Date} birthday The user birth date
 * @apiSuccess (Success (200)) {String} biography The user biography
 * @apiSuccess (Success (200)) {String} location The user location
 * @apiSuccess (Success (200)) {String} gender The user gender
 * @apiSuccess (Success (200)) {String} signature The user signature
 * @apiSuccess (Success (200)) {Boolean} active Whether the user is active or no
 * @apiSuccess (Success (200)) {Date} created_at The created date of the account
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
 *   "created_at": "2025-12-30 11:11:11"
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
      'created_at'
    ]
  });

  res.status(httpStatus.OK).json(user);
};

export { getUser };
