import httpStatus from 'http-status-codes';

import Warning from '../models/Warning.js';
import User from '../models/User.js';
import Config from '../models/Config.js';
import ErrorResponse from '../classes/ErrorResponse.js';

/**
 * @api {GET} /warning/all Get Warnings
 * @apiGroup Warning
 * @apiName WarningGetWarnings
 *
 * @apiDescription Get all the warnings of a user, ordered newest to oldest.
 *
 * @apiQuery {Number} userId The user id
 *
 * @apiSuccess (Success (200)) {Number} id The warning id
 * @apiSuccess (Success (200)) {String} message The warning message
 * @apiSuccess (Success (200)) {Date} date The warning date
 * @apiSuccess (Success (200)) {Object} moderator The moderator who gave the warning (null if there is none)
 * @apiSuccess (Success (200)) {Number} moderator.id The moderator id
 * @apiSuccess (Success (200)) {String} moderator.name The moderator name
 *
 * @apiSuccessExample Success Example
 * [
 *   {
 *     "id": 3,
 *     "message": "Please stay polite.",
 *     "date": "2026-09-29T16:09:20.000Z",
 *     "moderator": { "id": 1, "name": "John" }
 *   }
 * ]
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Public
 */
const getWarnings = async (req, res, next) => {
  const { userId } = req.query;

  const warnings = await Warning.findAll({
    where: { userId },
    attributes: ['id', 'message', 'date'],
    include: [{ model: User, as: 'moderator', attributes: ['id', 'name'] }],
    order: [['date', 'DESC']]
  });

  res.status(httpStatus.OK).json(warnings);
};

/**
 * @api {POST} /warning Create Warning
 * @apiGroup Warning
 * @apiName WarningCreateWarning
 *
 * @apiDescription Give a warning to a user. Only moderators and the admin can create a warning. Only regular users can be warned (a moderator or the admin cannot be warned), nobody can warn themselves, and a banned user cannot be warned. When the user's number of warnings reaches the forum warning limit, the user is banned.
 *
 * @apiBody {String} [message] The warning message
 * @apiBody {Number} userId The id of the warned user
 *
 * @apiParamExample {json} Body Example
 * {
 *   "message": "Please stay polite.",
 *   "userId": 12
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (400)) USER_BANNED The user is already banned
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 * @apiError (Error (403)) FORBIDDEN The user doesn't have permission to warn this user
 * @apiError (Error (404)) NOT_FOUND The warned user does not exist
 *
 * @apiPermission Private
 */
const createWarning = async (req, res, next) => {
  const { message, userId } = req.body;
  const { id: moderatorId, role } = req.user;

  if (role === 'regular' || Number(userId) === moderatorId) {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return next(new ErrorResponse('User not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  if (user.role !== 'regular') {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  if (user.active === false) {
    return next(new ErrorResponse('User already banned', httpStatus.BAD_REQUEST, 'USER_BANNED'));
  }

  await Warning.create({ message, userId, moderatorId });

  const nbWarnings = await Warning.count({ where: { userId } });
  const { warningLimit } = await Config.findOne({ attributes: ['warningLimit'] });

  if (nbWarnings >= warningLimit) {
    user.active = false;
    await user.save();
  }

  res.status(httpStatus.CREATED).end();
};

/**
 * @api {DELETE} /warning/:warningId Delete Warning
 * @apiGroup Warning
 * @apiName WarningDeleteWarning
 *
 * @apiDescription Delete a warning. Only moderators and the admin can delete a warning. If the user's number of warnings drops to one below the forum warning limit, the user is unbanned.
 *
 * @apiParam {Number} warningId The warning id
 *
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in or isn't a moderator or the admin
 * @apiError (Error (404)) NOT_FOUND The warning does not exist
 *
 * @apiPermission Private
 */
const deleteWarning = async (req, res, next) => {
  const { warningId } = req.params;

  const warning = await Warning.findOne({ where: { id: warningId } });

  if (!warning) {
    return next(new ErrorResponse('Warning not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  const { userId } = warning;

  await warning.destroy();

  const nbWarnings = await Warning.count({ where: { userId } });
  const { warningLimit } = await Config.findOne({ attributes: ['warningLimit'] });

  if (nbWarnings === warningLimit - 1) {
    await User.update({ active: true }, { where: { id: userId } });
  }

  res.status(httpStatus.OK).end();
};

export { getWarnings, createWarning, deleteWarning };
