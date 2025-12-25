import httpStatus from 'http-status-codes';

import configUtil from '../utils/config.util.js';

/**
 * @api {GET} /config/exists Exists
 * @apiGroup Config
 * @apiName ConfigExists
 *
 * @apiDescription Check if the forum configuration exists.
 *
 * @apiSuccess (Success (200)) {Boolean} exists  Whether the configuration exists
 * @apiSuccessExample Success Example
 * {
 *   "exists": true
 * }
 *
 * @apiPermission Public
 */
const exists = async (req, res, next) => {
  res.status(httpStatus.OK).json({
    exists: await configUtil.exists()
  });
};

export { exists };
