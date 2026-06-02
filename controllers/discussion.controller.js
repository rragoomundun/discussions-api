import httpStatus from 'http-status-codes';
import { Sequelize, QueryTypes } from 'sequelize';

import Discussion from '../models/Discussion.js';
import Forum from '../models/Forum.js';
import Category from '../models/Category.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

import sequelize from '../utils/db.util.js';

import ErrorResponse from '../classes/ErrorResponse.js';

/**
 * @api {POST} /discussion Create Discussion
 * @apiGroup Discussion
 * @apiName DiscussionCreateDiscussion
 *
 * @apiDescription Create a new discussion.
 *
 * @apiBody {String} title The discussion title.
 * @apiBody {Number} forumId The id of the forum the discussion belongs to.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "title": "My first discussion",
 *   "forumId": 1
 * }
 *
 * @apiSuccess (Success (201)) {Number} id The discussion id
 * @apiSuccess (Success (201)) {String} title The discussion title
 * @apiSuccess (Success (201)) {Boolean} open Whether the discussion is open
 * @apiSuccess (Success (201)) {Date} createdAt The creation date
 * @apiSuccess (Success (201)) {Date} updatedAt The last update date
 * @apiSuccess (Success (201)) {Number} forumId The forum id
 * @apiSuccess (Success (201)) {Number} userId The author id
 *
 * @apiSuccessExample Success Example
 * {
 *   "id": 1,
 *   "title": "My first discussion",
 *   "open": true,
 *   "createdAt": "2026-05-30T12:00:00.000Z",
 *   "updatedAt": "2026-05-30T12:00:00.000Z",
 *   "forumId": 1,
 *   "userId": 42
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 *
 * @apiPermission Private
 */
const createDiscussion = async (req, res, next) => {
  const { title, forumId } = req.body;

  const discussion = await Discussion.create({
    title,
    forumId,
    userId: req.user.id
  });

  res.status(httpStatus.CREATED).json(discussion);
};

/**
 * @api {PUT} /discussion/:discussionId Update Discussion
 * @apiGroup Discussion
 * @apiName DiscussionUpdateDiscussion
 *
 * @apiDescription Update a discussion. Only the owner, any moderator, or the admin can update.
 *
 * @apiParam {Number} discussionId The discussion id.
 *
 * @apiBody {String} title The new discussion title.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "title": "Updated title"
 * }
 *
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 * @apiError (Error (403)) FORBIDDEN The user doesn't have permission to update this discussion
 * @apiError (Error (404)) NOT_FOUND The discussion does not exist
 *
 * @apiPermission Private
 */
const updateDiscussion = async (req, res, next) => {
  const { discussionId } = req.params;
  const { title } = req.body;

  const discussion = await Discussion.findOne({ where: { id: discussionId } });

  if (!discussion) {
    return next(new ErrorResponse('Discussion not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  const { role, id: userId } = req.user;

  if (role === 'regular' && discussion.userId !== userId) {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  discussion.title = title;
  discussion.updatedAt = new Date();

  await discussion.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {GET} /discussion/:discussionId Get Discussion
 * @apiGroup Discussion
 * @apiName DiscussionGetDiscussion
 *
 * @apiDescription Get a single discussion.
 *
 * @apiParam {Number} discussionId The discussion id.
 *
 * @apiSuccess (Success (200)) {Number} id The discussion id
 * @apiSuccess (Success (200)) {String} title The discussion title
 * @apiSuccess (Success (200)) {Boolean} open Whether the discussion is open
 * @apiSuccess (Success (200)) {Object} forum The forum the discussion belongs to
 * @apiSuccess (Success (200)) {Number} forum.id The forum id
 * @apiSuccess (Success (200)) {String} forum.name The forum name
 * @apiSuccess (Success (200)) {Object} category The category the discussion belongs to
 * @apiSuccess (Success (200)) {Number} category.id The category id
 * @apiSuccess (Success (200)) {String} category.name The category name
 * @apiSuccess (Success (200)) {Number} pages The total number of message pages (20 messages per page)
 *
 * @apiSuccessExample Success Example
 * {
 *   "id": 1,
 *   "title": "My first discussion",
 *   "open": true,
 *   "forum": { "id": 2, "name": "General" },
 *   "category": { "id": 1, "name": "Main" },
 *   "pages": 3
 * }
 *
 * @apiError (Error (404)) NOT_FOUND The discussion does not exist
 *
 * @apiPermission Public
 */
const getDiscussion = async (req, res, next) => {
  const { discussionId } = req.params;

  const [discussion, messageCount] = await Promise.all([
    Discussion.findOne({
      where: { id: discussionId },
      attributes: ['id', 'title', 'open'],
      include: [
        {
          model: Forum,
          as: 'forum',
          attributes: ['id', 'name'],
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    }),
    Message.count({ where: { discussionId } })
  ]);

  if (!discussion) {
    return next(new ErrorResponse('Discussion not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  const pages = Math.max(1, Math.ceil(messageCount / 20));

  res.status(httpStatus.OK).json({
    id: discussion.id,
    title: discussion.title,
    open: discussion.open,
    forum: { id: discussion.forum.id, name: discussion.forum.name },
    category: { id: discussion.forum.category.id, name: discussion.forum.category.name },
    pages
  });
};

/**
 * @api {DELETE} /discussion/:discussionId Delete Discussion
 * @apiGroup Discussion
 * @apiName DiscussionDeleteDiscussion
 *
 * @apiDescription Delete a discussion. Only moderators and the admin can delete.
 *
 * @apiParam {Number} discussionId The discussion id.
 *
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 * @apiError (Error (403)) FORBIDDEN The user doesn't have permission to delete this discussion
 * @apiError (Error (404)) NOT_FOUND The discussion does not exist
 *
 * @apiPermission Private
 */
const deleteDiscussion = async (req, res, next) => {
  const { discussionId } = req.params;
  const { role } = req.user;

  if (role === 'regular') {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  const discussion = await Discussion.findOne({ where: { id: discussionId } });

  if (!discussion) {
    return next(new ErrorResponse('Discussion not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  await discussion.destroy();

  res.status(httpStatus.OK).end();
};

const DISCUSSIONS_PER_PAGE = 20;

/**
 * @api {GET} /discussion/all Get Discussions in Forum
 * @apiGroup Discussion
 * @apiName DiscussionGetDiscussionsInForum
 *
 * @apiDescription Get paginated discussions in a forum, ordered by most recent last message.
 *
 * @apiQuery {Number} forumId The forum id.
 * @apiQuery {Number} [page=1] The page number.
 *
 * @apiSuccess (Success (200)) {Object} category The category the forum belongs to
 * @apiSuccess (Success (200)) {Number} category.id The category id
 * @apiSuccess (Success (200)) {String} category.name The category name
 * @apiSuccess (Success (200)) {Object} forum The forum the discussions belong to
 * @apiSuccess (Success (200)) {Number} forum.id The forum id
 * @apiSuccess (Success (200)) {String} forum.name The forum name
 * @apiSuccess (Success (200)) {Object[]} discussions The list of discussions
 * @apiSuccess (Success (200)) {Number} discussions.id The discussion id
 * @apiSuccess (Success (200)) {String} discussions.title The discussion title
 * @apiSuccess (Success (200)) {Boolean} discussions.open Whether the discussion is open
 * @apiSuccess (Success (200)) {Date} discussions.createdAt The creation date
 * @apiSuccess (Success (200)) {Object} discussions.user The discussion author
 * @apiSuccess (Success (200)) {Number} discussions.user.id The author id
 * @apiSuccess (Success (200)) {String} discussions.user.name The author name
 * @apiSuccess (Success (200)) {Number} discussions.nbMessages The number of messages in the discussion
 * @apiSuccess (Success (200)) {Object} discussions.lastMessage The last message in the discussion
 * @apiSuccess (Success (200)) {Number} discussions.lastMessage.messageId The last message id
 * @apiSuccess (Success (200)) {Date} discussions.lastMessage.date The last message date
 * @apiSuccess (Success (200)) {Object} discussions.lastMessage.user The last message author
 * @apiSuccess (Success (200)) {Number} discussions.lastMessage.user.id The last message author id
 * @apiSuccess (Success (200)) {String} discussions.lastMessage.user.name The last message author name
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Public
 */
const getDiscussionsInForum = async (req, res, next) => {
  const forumId = parseInt(req.query.forumId);
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * DISCUSSIONS_PER_PAGE;

  const [forum, discussions] = await Promise.all([
    Forum.findOne({
      where: { id: forumId },
      attributes: ['id', 'name'],
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    }),
    Discussion.findAll({
      where: { forumId },
      attributes: ['id', 'title', 'open', 'createdAt'],
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [
        [
          Sequelize.literal(`(SELECT MAX("date") FROM "Message" WHERE "discussionId" = "Discussion"."id")`),
          'DESC NULLS LAST'
        ]
      ],
      limit: DISCUSSIONS_PER_PAGE,
      offset
    })
  ]);

  const category = forum?.category ? { id: forum.category.id, name: forum.category.name } : null;
  const forumMeta = forum ? { id: forum.id, name: forum.name } : null;

  if (discussions.length === 0) {
    return res.status(httpStatus.OK).json({ category, forum: forumMeta, discussions: [] });
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
    user: { id: d.user.id, name: d.user.name },
    nbMessages: messageCountMap[d.id] ?? 0,
    lastMessage: lastMessageMap[d.id] || null
  }));

  res.status(httpStatus.OK).json({ category, forum: forumMeta, discussions: result });
};

/**
 * @api {PUT} /discussion/:discussionId/open Set Discussion Open
 * @apiGroup Discussion
 * @apiName DiscussionSetDiscussionOpen
 *
 * @apiDescription Set the open flag of a discussion. Only moderators and the admin can perform this action.
 *
 * @apiParam {Number} discussionId The discussion id.
 *
 * @apiBody {Boolean} open Whether the discussion is open.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "open": false
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 * @apiError (Error (403)) FORBIDDEN The user doesn't have permission to update this discussion
 * @apiError (Error (404)) NOT_FOUND The discussion does not exist
 *
 * @apiPermission Private
 */
const setDiscussionOpen = async (req, res, next) => {
  const { discussionId } = req.params;
  const { open } = req.body;
  const { role } = req.user;

  if (role === 'regular') {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  const discussion = await Discussion.findOne({ where: { id: discussionId } });

  if (!discussion) {
    return next(new ErrorResponse('Discussion not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  discussion.open = open;

  await discussion.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {GET} /discussion/pages Get Discussion Pages
 * @apiGroup Discussion
 * @apiName DiscussionGetDiscussionPages
 *
 * @apiDescription Get the number of discussion pages in a forum.
 *
 * @apiQuery {Number} forumId The forum id.
 *
 * @apiSuccess (Success (200)) {Number} pages The number of discussion pages
 *
 * @apiSuccessExample Success Example
 * {
 *   "pages": 4
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (404)) NOT_FOUND The forum does not exist
 *
 * @apiPermission Public
 */
const getDiscussionPages = async (req, res, next) => {
  const forumId = parseInt(req.query.forumId);

  if ((await Forum.count({ where: { id: forumId } })) === 0) {
    return next(new ErrorResponse('Forum not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  const count = await Discussion.count({ where: { forumId } });
  let pages = Math.ceil(count / DISCUSSIONS_PER_PAGE);

  if (pages === 0) {
    pages = 1;
  }

  res.status(httpStatus.OK).json({ pages });
};

export {
  createDiscussion,
  updateDiscussion,
  getDiscussion,
  deleteDiscussion,
  getDiscussionsInForum,
  setDiscussionOpen,
  getDiscussionPages
};
