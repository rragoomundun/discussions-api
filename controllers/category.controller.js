import httpStatus from 'http-status-codes';

import Category from '../models/Category.js';
import Forum from '../models/Forum.js';

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
 *       "index": 0
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

  res.status(httpStatus.OK).json(category);
};

export { getForumInCategory };
