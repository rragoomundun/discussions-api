import httpStatus from 'http-status-codes';

import Discussion from '../models/Discussion.js';

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

export { createDiscussion };
