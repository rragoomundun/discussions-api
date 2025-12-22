import httpStatus from 'http-status-codes';

import siteUtil from '../utils/site.util.js';
/**
 * @api {GET} /site/is-new Is New
 * @apiGroup Site
 * @apiName SiteIsNew
 *
 * @apiDescription Check if the forum is new (has no information yet).
 *
 * @apiSuccess (Success (200)) {Boolean} isNew  Whether the forum is new
 * @apiSuccessExample Success Example
 * {
 *   "isNew": true
 * }
 *
 * @apiPermission Public
 */
const isNew = async (req, res, next) => {
  res.status(httpStatus.OK).json({
    isNew: await siteUtil.isNew()
  });
};

export { isNew };
