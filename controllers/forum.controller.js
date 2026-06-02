import httpStatus from 'http-status-codes';
import { Op, QueryTypes } from 'sequelize';

import Category from '../models/Category.js';
import Forum from '../models/Forum.js';
import Discussion from '../models/Discussion.js';
import Message from '../models/Message.js';

import sequelize from '../utils/db.util.js';

import ErrorResponse from '../classes/ErrorResponse.js';

/**
 * @api {GET} /forum Get Forum
 * @apiGroup Forum
 * @apiName ForumGetForum
 *
 * @apiDescription Get categories and forums.
 *
 * @apiSuccess (Success (200)) {Number} .id The category id
 * @apiSuccess (Success (200)) {String} .name The category name.
 * @apiSuccess (Success (200)) {String} .description The category description.
 * @apiSuccess (Success (200)) {String} .metaDescription The category meta description.
 * @apiSuccess (Success (200)) {String} .index The category position.
 * @apiSuccess (Success (200)) {Number} .forums.id The forum id
 * @apiSuccess (Success (200)) {String} .forums.name Forum's name.
 * @apiSuccess (Success (200)) {String} .forums.description Forum's description.
 * @apiSuccess (Success (200)) {String} .forums.metaDescription Forum's meta description.
 * @apiSuccess (Success (200)) {String} .forums.index Forum's position.
 * @apiSuccess (Success (200)) {Number} .forums.nbDiscussions The number of discussions in the forum.
 * @apiSuccess (Success (200)) {Number} .forums.nbMessages The total number of messages in the forum.
 * @apiSuccess (Success (200)) {Object} .forums.lastMessage The last message posted in the forum, or null.
 * @apiSuccess (Success (200)) {Object} .forums.lastMessage.discussion The discussion the last message belongs to.
 * @apiSuccess (Success (200)) {Number} .forums.lastMessage.discussion.id The discussion id.
 * @apiSuccess (Success (200)) {String} .forums.lastMessage.discussion.name The discussion title.
 * @apiSuccess (Success (200)) {Date} .forums.lastMessage.date The date of the last message.
 *
 * @apiSuccessExample Success Example
 * [
 *   {
 *     "id": 1,
 *     "name": "Category 1",
 *     "description": "Lorem ipsum...",
 *     "metaDescription": "Lorem ipsum...",
 *     "index": 0,
 *     "forums": [
 *       {
 *         "id": 1,
 *         "name": "Forum 1",
 *         "description": "Lorem ipsum...",
 *         "metaDescription": "Lorem ipsum...",
 *         "index": 0,
 *         "nbDiscussions": 12,
 *         "nbMessages": 48,
 *         "lastMessage": {
 *           "discussion": { "id": 5, "name": "Best tips?" },
 *           "date": "2026-05-31T10:00:00.000Z"
 *         }
 *       }
 *     ]
 *   }
 * ]
 *
 * @apiPermission Public
 */
const getForum = async (req, res, next) => {
  const categories = await Category.findAll({
    order: [
      ['index', 'ASC'],
      [{ model: Forum, as: 'forums' }, 'index', 'ASC']
    ],
    include: [
      {
        model: Forum,
        as: 'forums',
        attributes: ['id', 'name', 'description', 'metaDescription', 'index']
      }
    ]
  });

  const forumIds = categories.flatMap((c) => c.forums.map((f) => f.id));

  if (forumIds.length === 0) {
    return res.status(httpStatus.OK).json(categories);
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

  const result = categories.map((category) => {
    const cat = category.toJSON();
    cat.forums = cat.forums.map((forum) => ({
      ...forum,
      nbDiscussions: discussionCountMap[forum.id] ?? 0,
      nbMessages: messageCountMap[forum.id] ?? 0,
      lastMessage: lastMessageMap[forum.id] ?? null
    }));
    return cat;
  });

  res.status(httpStatus.OK).json(result);
};

/**
 * @api {PUT} /forum Update Forum
 * @apiGroup Forum
 * @apiName ForumUpdateForum
 *
 * @apiDescription Create and/or update categories and forums.
 *
 * @apiBody {String} .name The category name.
 * @apiBody {String} .description The category description.
 * @apiBody {String} .metaDescription The category meta description.
 * @apiBody {String} .index The category position.
 * @apiBody {String} .forums.name Forum's name.
 * @apiBody {String} .forums.description Forum's description.
 * @apiBody {String} .forums.metaDescription Forum's meta description.
 * @apiBody {String} .forums.index Forum's position.
 *
 * @apiParamExample {json} Body Example
 * [
 *   {
 *     "name": "Category 1",
 *     "description": "Lorem ipsum...",
 *     "metaDescription": "Lorem ipsum...",
 *     "index": 0,
 *     "forums": [
 *       {
 *         "name": "Forum 1",
 *         "description": "Lorem ipsum...",
 *         "metaDescription": "Lorem ipsum...",
 *         "index": 0
 *       },
 *       {
 *         "name": "Forum 2",
 *         "description": "Lorem ipsum...",
 *         "metaDescription": "Lorem ipsum...",
 *         "index": 1
 *       }
 *     ]
 *   }
 * ]
 *
 * @apiSuccess (Success (200)) {Number} .id The category id
 * @apiSuccess (Success (200)) {String} .name The category name.
 * @apiSuccess (Success (200)) {String} .description The category description.
 * @apiSuccess (Success (200)) {String} .metaDescription The category meta description.
 * @apiSuccess (Success (200)) {String} .index The category position.
 * @apiSuccess (Success (200)) {Number} .forums.id The forum id
 * @apiSuccess (Success (200)) {String} .forums.name Forum's name.
 * @apiSuccess (Success (200)) {String} .forums.description Forum's description.
 * @apiSuccess (Success (200)) {String} .forums.metaDescription Forum's meta description.
 * @apiSuccess (Success (200)) {String} .forums.index Forum's position.

 * @apiSuccessExample Success Example
 * [
 *   {
 *     "id": 1,
 *     "name": "Category 1",
 *     "description": "Lorem ipsum...",
 *     "metaDescription": "Lorem ipsum...",
 *     "index": 0,
 *     "forums": [
 *       {
 *         "id": 1,
 *         "name": "Forum 1",
 *         "description": "Lorem ipsum...",
 *         "metaDescription": "Lorem ipsum...",
 *         "index": 0
 *       },
 *       {
 *         "id": 2,
 *         "name": "Forum 2",
 *         "description": "Lorem ipsum...",
 *         "metaDescription": "Lorem ipsum...",
 *         "index": 1
 *       }
 *     ]
 *   }
 * ]
 *
 * @apiPermission Private
 */
const updateForum = async (req, res, next) => {
  const categoryIds = req.body
    .filter((category) => [null, undefined].includes(category.id) === false)
    .map((category) => category.id);
  const returnedJson = [];
  let i = 0;

  await Category.destroy({ where: { id: { [Op.notIn]: categoryIds } } });

  for (const category of req.body) {
    const categoryName = category.name;
    const categoryDescription = category.description;
    const categoryMetaDescription = category.metaDescription;
    const categoryIndex = category.index;
    let categoryObj;

    if (!category.id) {
      categoryObj = await Category.create({
        name: categoryName,
        description: categoryDescription,
        metaDescription: categoryMetaDescription,
        index: categoryIndex
      });
    } else {
      categoryObj = await Category.findOne({ where: { id: category.id } });

      categoryObj.name = categoryName;
      categoryObj.description = categoryDescription;
      categoryObj.metaDescription = categoryMetaDescription;
      categoryObj.index = categoryIndex;

      await categoryObj.save();
    }

    returnedJson.push({
      id: categoryObj.id,
      name: categoryObj.name,
      description: categoryObj.description,
      metaDescription: categoryObj.metaDescription,
      index: categoryObj.index,
      forums: []
    });

    const forumIds = category.forums
      .filter((forum) => [null, undefined].includes(forum.id) === false)
      .map((forum) => forum.id);

    // Put all forums in the proper category
    await Forum.update({ categoryId: category.id }, { where: { id: { [Op.in]: forumIds } } });

    // Destroy forums
    await Forum.destroy({ where: { id: { [Op.notIn]: forumIds }, categoryId: categoryObj.id } });

    for (const forum of category.forums) {
      let forumObj;
      const forumName = forum.name;
      const forumDescription = forum.description;
      const forumMetaDescription = forum.metaDescription;
      const forumIndex = forum.index;

      if (!forum.id) {
        forumObj = await Forum.create({
          name: forumName,
          description: forumDescription,
          metaDescription: forumMetaDescription,
          index: forumIndex,
          categoryId: categoryObj.id
        });
      } else {
        forumObj = await Forum.findOne({ where: { id: forum.id } });

        forumObj.name = forumName;
        forumObj.description = forumDescription;
        forumObj.metaDescription = forumMetaDescription;
        forumObj.index = forumIndex;
        forumObj.categoryId = categoryObj.id;

        await forumObj.save();
      }

      returnedJson[i].forums.push({
        id: forumObj.id,
        name: forumObj.name,
        description: forumObj.description,
        metaDescription: forumObj.metaDescription,
        index: forumObj.index
      });
    }

    i++;
  }

  res.status(httpStatus.OK).json(returnedJson);
};

const DISCUSSIONS_PER_PAGE = 20;

/**
 * @api {GET} /forum/:forumId/meta Get Forum Meta
 * @apiGroup Forum
 * @apiName ForumGetForumMeta
 *
 * @apiDescription Get meta information for a forum: id, name, category, and number of discussion pages.
 *
 * @apiParam {Number} forumId The forum id.
 *
 * @apiSuccess (Success (200)) {Number} id The forum id
 * @apiSuccess (Success (200)) {String} name The forum name
 * @apiSuccess (Success (200)) {Object} category The category the forum belongs to
 * @apiSuccess (Success (200)) {Number} category.id The category id
 * @apiSuccess (Success (200)) {String} category.name The category name
 * @apiSuccess (Success (200)) {Number} nbPages The number of discussion pages (20 per page, minimum 1)
 *
 * @apiSuccessExample Success Example
 * {
 *   "id": 1,
 *   "name": "General",
 *   "category": { "id": 1, "name": "Main" },
 *   "nbPages": 3
 * }
 *
 * @apiError (Error (404)) NOT_FOUND The forum does not exist
 *
 * @apiPermission Public
 */
const getForumMeta = async (req, res, next) => {
  const { forumId } = req.params;

  const [forum, nbDiscussions] = await Promise.all([
    Forum.findOne({
      where: { id: forumId },
      attributes: ['id', 'name'],
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    }),
    Discussion.count({ where: { forumId } })
  ]);

  if (!forum) {
    return next(new ErrorResponse('Forum not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  const nbPages = Math.max(1, Math.ceil(nbDiscussions / DISCUSSIONS_PER_PAGE));

  res.status(httpStatus.OK).json({
    id: forum.id,
    name: forum.name,
    category: { id: forum.category.id, name: forum.category.name },
    nbPages
  });
};

export { getForum, updateForum, getForumMeta };
