import httpStatus from 'http-status-codes';
import { Op } from 'sequelize';

import Category from '../models/Category.js';
import Forum from '../models/Forum.js';

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
 *         "index": 0
 *        },
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

  res.status(httpStatus.OK).json(categories);
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

export { getForum, updateForum };
