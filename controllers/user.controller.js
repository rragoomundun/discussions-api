import httpStatus from 'http-status-codes';
import { QueryTypes } from 'sequelize';

import User from '../models/User.js';
import Discussion from '../models/Discussion.js';
import Message from '../models/Message.js';
import Forum from '../models/Forum.js';

import sequelize from '../utils/db.util.js';

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
 * @apiSuccess (Success (200)) {String} image The user profile picture
 * @apiSuccess (Success (200)) {Number} nbDiscussions The number of discussions started by the user
 * @apiSuccess (Success (200)) {Number} nbMessages The number of messages posted by the user
 * @apiSuccess (Success (200)) {Date} createdAt The created date of the account
 *
 * @apiSuccessExample Success Example
 * {
 *   "name": "Tom Appolo",
 *   "role": "regular",
 *   "image": null,
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
      attributes: ['name', 'role', 'image', 'createdAt']
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
    image: user.image,
    nbDiscussions,
    nbMessages,
    createdAt: user.createdAt
  });
};

/**
 * @api {GET} /user/:id/informations Get User Information
 * @apiGroup User
 * @apiName UserGetUserInformation
 *
 * @apiDescription Get the extended public profile information of a specific user.
 *
 * @apiParam {Number} id The user id.
 *
 * @apiSuccess (Success (200)) {String} birthday The user birth date (YYYY-MM-DD)
 * @apiSuccess (Success (200)) {String} location The user location
 * @apiSuccess (Success (200)) {String} gender The user gender
 * @apiSuccess (Success (200)) {String} biography The user biography
 *
 * @apiSuccessExample Success Example
 * {
 *   "birthday": "1990-05-12",
 *   "location": "France",
 *   "gender": "male",
 *   "biography": "Lorem ipsum..."
 * }
 *
 * @apiError (Error (404)) NOT_FOUND The user does not exist
 *
 * @apiPermission Public
 */
const getUserInformation = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id },
    attributes: ['birthday', 'location', 'gender', 'biography']
  });

  if (!user) {
    return next(new ErrorResponse('User not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  res.status(httpStatus.OK).json({
    birthday: user.birthday ? user.birthday.toISOString().split('T')[0] : null,
    location: user.location,
    gender: user.gender,
    biography: user.biography
  });
};

const USER_DISCUSSIONS_PER_PAGE = 20;

/**
 * @api {GET} /user/:id/discussions Get User Discussions
 * @apiGroup User
 * @apiName UserGetUserDiscussions
 *
 * @apiDescription Get paginated discussions started by a user, ordered by most recent first.
 *
 * @apiParam {Number} id The user id.
 * @apiQuery {Number} [page=1] The page number.
 *
 * @apiSuccess (Success (200)) {Number} .id The discussion id
 * @apiSuccess (Success (200)) {String} .title The discussion title
 * @apiSuccess (Success (200)) {Boolean} .open Whether the discussion is open
 * @apiSuccess (Success (200)) {Date} .createdAt The creation date
 * @apiSuccess (Success (200)) {Object} .user The discussion author
 * @apiSuccess (Success (200)) {Number} .user.id The author id
 * @apiSuccess (Success (200)) {String} .user.name The author name
 * @apiSuccess (Success (200)) {String} .user.role The author role
 * @apiSuccess (Success (200)) {Number} .nbMessages The number of messages in the discussion
 * @apiSuccess (Success (200)) {Object} .lastMessage The last message in the discussion
 * @apiSuccess (Success (200)) {Number} .lastMessage.messageId The last message id
 * @apiSuccess (Success (200)) {Date} .lastMessage.date The last message date
 * @apiSuccess (Success (200)) {Object} .lastMessage.user The last message author
 * @apiSuccess (Success (200)) {Number} .lastMessage.user.id The last message author id
 * @apiSuccess (Success (200)) {String} .lastMessage.user.name The last message author name
 *
 * @apiPermission Public
 */
const getUserDiscussions = async (req, res, next) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * USER_DISCUSSIONS_PER_PAGE;

  const discussions = await Discussion.findAll({
    where: { userId: id },
    attributes: ['id', 'title', 'open', 'createdAt'],
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'role'] }],
    order: [['createdAt', 'DESC']],
    limit: USER_DISCUSSIONS_PER_PAGE,
    offset
  });

  if (discussions.length === 0) {
    return res.status(httpStatus.OK).json([]);
  }

  const discussionIds = discussions.map((d) => d.id);

  const [lastMessages, messageCounts] = await Promise.all([
    sequelize.query(
      `SELECT DISTINCT ON ("discussionId")
        m.id, m.date, m."discussionId", u.id AS "userId", u.name AS "userName"
       FROM "Message" m
       JOIN "User" u ON u.id = m."authorId"
       WHERE m."discussionId" IN (:discussionIds)
       ORDER BY "discussionId", m.date DESC`,
      { replacements: { discussionIds }, type: QueryTypes.SELECT }
    ),
    Message.findAll({
      attributes: ['discussionId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { discussionId: discussionIds },
      group: ['discussionId'],
      raw: true
    })
  ]);

  const lastMessageMap = {};

  for (const msg of lastMessages) {
    lastMessageMap[msg.discussionId] = {
      messageId: msg.id,
      date: msg.date,
      user: { id: msg.userId, name: msg.userName }
    };
  }

  const messageCountMap = Object.fromEntries(messageCounts.map((r) => [r.discussionId, parseInt(r.count)]));

  const result = discussions.map((d) => ({
    id: d.id,
    title: d.title,
    open: d.open,
    createdAt: d.createdAt,
    user: { id: d.user.id, name: d.user.name, role: d.user.role },
    nbMessages: messageCountMap[d.id] ?? 0,
    lastMessage: lastMessageMap[d.id] || null
  }));

  res.status(httpStatus.OK).json(result);
};

/**
 * @api {GET} /user/:id/discussions/meta Get User Discussions Meta
 * @apiGroup User
 * @apiName UserGetUserDiscussionsMeta
 *
 * @apiDescription Get meta information for a user's discussions: number of pages.
 *
 * @apiParam {Number} id The user id.
 *
 * @apiSuccess (Success (200)) {Number} nbPages The number of discussion pages (20 per page, minimum 1)
 *
 * @apiSuccessExample Success Example
 * {
 *   "nbPages": 3
 * }
 *
 * @apiPermission Public
 */
const getUserDiscussionsMeta = async (req, res, next) => {
  const { id } = req.params;

  const nbDiscussions = await Discussion.count({ where: { userId: id } });
  const nbPages = Math.max(1, Math.ceil(nbDiscussions / USER_DISCUSSIONS_PER_PAGE));

  res.status(httpStatus.OK).json({ nbPages });
};

const USER_MESSAGES_PER_PAGE = 20;

/**
 * @api {GET} /user/:id/messages Get User Messages
 * @apiGroup User
 * @apiName UserGetUserMessages
 *
 * @apiDescription Get paginated messages posted by a user, ordered by most recent first.
 *
 * @apiParam {Number} id The user id.
 * @apiQuery {Number} [page=1] The page number.
 *
 * @apiSuccess (Success (200)) {Object} .discussion The discussion the message belongs to
 * @apiSuccess (Success (200)) {Number} .discussion.id The discussion id
 * @apiSuccess (Success (200)) {String} .discussion.title The discussion title
 * @apiSuccess (Success (200)) {Number} .discussion.page The page (20 messages per page) where the message is posted in the discussion
 * @apiSuccess (Success (200)) {Object} .forum The forum the discussion belongs to
 * @apiSuccess (Success (200)) {Number} .forum.id The forum id
 * @apiSuccess (Success (200)) {String} .forum.name The forum name
 * @apiSuccess (Success (200)) {Object} .message The message
 * @apiSuccess (Success (200)) {Number} .message.id The message id
 * @apiSuccess (Success (200)) {String} .message.message The message content
 * @apiSuccess (Success (200)) {Date} .message.date The message date
 *
 * @apiPermission Public
 */
const getUserMessages = async (req, res, next) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * USER_MESSAGES_PER_PAGE;

  const messages = await Message.findAll({
    where: { authorId: id },
    attributes: ['id', 'message', 'date'],
    include: [
      {
        model: Discussion,
        as: 'discussion',
        attributes: ['id', 'title'],
        include: [{ model: Forum, as: 'forum', attributes: ['id', 'name'] }]
      }
    ],
    order: [['date', 'DESC']],
    limit: USER_MESSAGES_PER_PAGE,
    offset
  });

  if (messages.length === 0) {
    return res.status(httpStatus.OK).json([]);
  }

  const messageIds = messages.map((m) => m.id);
  const discussionIds = [...new Set(messages.map((m) => m.discussion.id))];

  const rankRows = await sequelize.query(
    `SELECT id, row_number FROM (
       SELECT id, ROW_NUMBER() OVER (PARTITION BY "discussionId" ORDER BY date ASC, id ASC) AS row_number
       FROM "Message"
       WHERE "discussionId" IN (:discussionIds)
     ) sub
     WHERE id IN (:messageIds)`,
    { replacements: { discussionIds, messageIds }, type: QueryTypes.SELECT }
  );

  const pageMap = Object.fromEntries(
    rankRows.map((r) => [r.id, Math.ceil(parseInt(r.row_number) / USER_MESSAGES_PER_PAGE)])
  );

  const result = messages.map((m) => ({
    discussion: {
      id: m.discussion.id,
      title: m.discussion.title,
      page: pageMap[m.id]
    },
    forum: {
      id: m.discussion.forum.id,
      name: m.discussion.forum.name
    },
    message: {
      id: m.id,
      message: m.message,
      date: m.date
    }
  }));

  res.status(httpStatus.OK).json(result);
};

/**
 * @api {GET} /user/:id/messages/meta Get User Messages Meta
 * @apiGroup User
 * @apiName UserGetUserMessagesMeta
 *
 * @apiDescription Get meta information for a user's messages: number of pages.
 *
 * @apiParam {Number} id The user id.
 *
 * @apiSuccess (Success (200)) {Number} nbPages The number of message pages (20 per page, minimum 1)
 *
 * @apiSuccessExample Success Example
 * {
 *   "nbPages": 3
 * }
 *
 * @apiPermission Public
 */
const getUserMessagesMeta = async (req, res, next) => {
  const { id } = req.params;

  const nbMessages = await Message.count({ where: { authorId: id } });
  const nbPages = Math.max(1, Math.ceil(nbMessages / USER_MESSAGES_PER_PAGE));

  res.status(httpStatus.OK).json({ nbPages });
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
  getUserInformation,
  getUserDiscussions,
  getUserDiscussionsMeta,
  getUserMessages,
  getUserMessagesMeta,
  updateEmail,
  updatePassword,
  updateProfilePicture,
  updatePersonalInformation,
  updateSignature
};
