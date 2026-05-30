import httpStatus from 'http-status-codes';

import Discussion from '../models/Discussion.js';
import Forum from '../models/Forum.js';
import Category from '../models/Category.js';

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
 *
 * @apiSuccessExample Success Example
 * {
 *   "id": 1,
 *   "title": "My first discussion",
 *   "open": true,
 *   "forum": { "id": 2, "name": "General" },
 *   "category": { "id": 1, "name": "Main" }
 * }
 *
 * @apiError (Error (404)) NOT_FOUND The discussion does not exist
 *
 * @apiPermission Public
 */
const getDiscussion = async (req, res, next) => {
  const { discussionId } = req.params;

  const discussion = await Discussion.findOne({
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
  });

  if (!discussion) {
    return next(new ErrorResponse('Discussion not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  res.status(httpStatus.OK).json({
    id: discussion.id,
    title: discussion.title,
    open: discussion.open,
    forum: { id: discussion.forum.id, name: discussion.forum.name },
    category: { id: discussion.forum.category.id, name: discussion.forum.category.name }
  });
};

export { createDiscussion, updateDiscussion, getDiscussion };
