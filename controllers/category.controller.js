import httpStatus from 'http-status-codes';
import { QueryTypes } from 'sequelize';

import Category from '../models/Category.js';
import Forum from '../models/Forum.js';
import Discussion from '../models/Discussion.js';
import Message from '../models/Message.js';

import sequelize from '../utils/db.util.js';

import ErrorResponse from '../classes/ErrorResponse.js';

/**
 * @api {GET} /category/:categoryId/forum Get Forum in Category
 * @apiGroup Category
 * @apiName CategoryGetForumInCategory
 *
 * @apiDescription Get a category and its forums.
 *
 * @apiParam {Number} categoryId The category id.
 *
 * @apiSuccess (Success (200)) {Number} id The category id
 * @apiSuccess (Success (200)) {String} name The category name
 * @apiSuccess (Success (200)) {String} description The category description
 * @apiSuccess (Success (200)) {String} metaDescription The category meta description
 * @apiSuccess (Success (200)) {Number} forums.id The forum id
 * @apiSuccess (Success (200)) {String} forums.name The forum name
 * @apiSuccess (Success (200)) {String} forums.description The forum description
 * @apiSuccess (Success (200)) {String} forums.metaDescription The forum meta description
 * @apiSuccess (Success (200)) {Number} forums.index The forum position
 * @apiSuccess (Success (200)) {Number} forums.nbDiscussions The number of discussions in the forum.
 * @apiSuccess (Success (200)) {Number} forums.nbMessages The total number of messages in the forum.
 * @apiSuccess (Success (200)) {Object} forums.lastMessage The last message posted in the forum, or null.
 * @apiSuccess (Success (200)) {Object} forums.lastMessage.discussion The discussion the last message belongs to.
 * @apiSuccess (Success (200)) {Number} forums.lastMessage.discussion.id The discussion id.
 * @apiSuccess (Success (200)) {String} forums.lastMessage.discussion.name The discussion title.
 * @apiSuccess (Success (200)) {Date} forums.lastMessage.date The date of the last message.
 *
 * @apiSuccessExample Success Example
 * {
 *   "id": 1,
 *   "name": "Category 1",
 *   "description": "Lorem ipsum...",
 *   "metaDescription": "Lorem ipsum...",
 *   "forums": [
 *     {
 *       "id": 1,
 *       "name": "Forum 1",
 *       "description": "Lorem ipsum...",
 *       "metaDescription": "Lorem ipsum...",
 *       "index": 0,
 *       "nbDiscussions": 12,
 *       "nbMessages": 48,
 *       "lastMessage": {
 *         "discussion": { "id": 5, "name": "Best tips?" },
 *         "date": "2026-05-31T10:00:00.000Z"
 *       }
 *     }
 *   ]
 * }
 *
 * @apiError (Error (404)) NOT_FOUND The category does not exist
 *
 * @apiPermission Public
 */
const getForumInCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({
    where: { id: categoryId },
    attributes: ['id', 'name', 'description', 'metaDescription'],
    order: [[{ model: Forum, as: 'forums' }, 'index', 'ASC']],
    include: [
      {
        model: Forum,
        as: 'forums',
        attributes: ['id', 'name', 'description', 'metaDescription', 'index']
      }
    ]
  });

  if (!category) {
    return next(new ErrorResponse('Category not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  const forumIds = category.forums.map((f) => f.id);

  if (forumIds.length === 0) {
    return res.status(httpStatus.OK).json(category);
  }

  const [discussionCounts, messageCounts, lastMessages] = await Promise.all([
    Discussion.findAll({
      attributes: ['forumId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { forumId: forumIds },
      group: ['forumId'],
      raw: true
    }),
    Message.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Message.id')), 'count'],
        [sequelize.col('discussion.forumId'), 'forumId']
      ],
      include: [{ model: Discussion, as: 'discussion', attributes: [], where: { forumId: forumIds } }],
      group: ['discussion.forumId'],
      raw: true,
      subQuery: false
    }),
    sequelize.query(
      `SELECT DISTINCT ON (d."forumId") m.date, d.id AS "discussionId", d.title AS "discussionTitle", d."forumId"
       FROM "Message" m
       JOIN "Discussion" d ON m."discussionId" = d.id
       WHERE d."forumId" IN (:forumIds)
       ORDER BY d."forumId", m.date DESC`,
      { replacements: { forumIds }, type: QueryTypes.SELECT }
    )
  ]);

  const discussionCountMap = Object.fromEntries(discussionCounts.map((r) => [r.forumId, parseInt(r.count)]));
  const messageCountMap = Object.fromEntries(messageCounts.map((r) => [r.forumId, parseInt(r.count)]));
  const lastMessageMap = Object.fromEntries(
    lastMessages.map((r) => [
      r.forumId,
      { discussion: { id: r.discussionId, name: r.discussionTitle }, date: r.date }
    ])
  );

  const cat = category.toJSON();
  cat.forums = cat.forums.map((forum) => ({
    ...forum,
    nbDiscussions: discussionCountMap[forum.id] ?? 0,
    nbMessages: messageCountMap[forum.id] ?? 0,
    lastMessage: lastMessageMap[forum.id] ?? null
  }));

  res.status(httpStatus.OK).json(cat);
};

export { getForumInCategory };
