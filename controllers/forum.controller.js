import httpStatus from 'http-status-codes';
import { Op } from 'sequelize';

import Category from '../models/Category.js';
import Forum from '../models/Forum.js';

/**
 * @api {PUT} /forum Update Forum
 * @apiGroup Forum
 * @apiName ForumUpdateForum
 *
 * @apiDescription Create and/or update categories and forums.
 *
 * @apiBody {String} name The category name.
 * @apiBody {String} index The category position.
 * @apiBody {String} forums.name Forum's name.
 * @apiBody {String} forums.description Forum's description.
 * @apiBody {String} forums.meta_description Forum's meta description.
 * @apiBody {String} forums.index Forum's position.
 *
 * @apiParamExample {json} Body Example
 * [
 *   {
 *     "name": "Category 1",
 *     "index": 0,
 *     "forums": [
 *       {
 *         "name": "Forum 1",
 *         "description": "Lorem ipsum...",
 *         "meta_description": "Lorem ipsum...",
 *         "index": 0
 *       },
 *       {
 *         "name": "Forum 2",
 *         "description": "Lorem ipsum...",
 *         "meta_description": "Lorem ipsum...",
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

  await Category.destroy({ where: { id: { [Op.notIn]: categoryIds } } });

  for (const category of req.body) {
    const categoryName = category.name;
    const categoryIndex = category.index;
    let categoryObj;

    if (!category.id) {
      categoryObj = await Category.create({ name: categoryName, index: categoryIndex });
    } else {
      categoryObj = await Category.findOne({ where: { id: category.id } });

      categoryObj.name = categoryName;
      categoryObj.index = categoryIndex;

      await categoryObj.save();
    }

    const forumIds = category.forums
      .filter((forum) => [null, undefined].includes(forum.id) === false)
      .map((forum) => forum.id);

    await Forum.destroy({ where: { id: { [Op.notIn]: forumIds }, category_id: categoryObj.id } });

    for (const forum of category.forums) {
      const forumName = forum.name;
      const forumDescription = forum.description;
      const forumMetaDescription = forum.meta_description;
      const forumIndex = forum.index;

      if (!forum.id) {
        await Forum.create({
          name: forumName,
          description: forumDescription,
          meta_description: forumMetaDescription,
          index: forumIndex,
          category_id: categoryObj.id
        });
      } else {
        const forumObj = await Forum.findOne({ where: { id: forum.id } });

        forumObj.name = forumName;
        forumObj.description = forumDescription;
        forumObj.meta_description = forumMetaDescription;
        forumObj.index = forumIndex;
        forumObj.category_id = categoryObj.id;

        await forumObj.save();
      }
    }
  }

  res.status(httpStatus.OK).end();
};

export { updateForum };
