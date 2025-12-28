import httpStatus from 'http-status-codes';

import configUtil from '../utils/config.util.js';
import adminUtil from '../utils/admin.util.js';

/**
 * @api {GET} /config/exists Exists
 * @apiGroup Config
 * @apiName ConfigExists
 *
 * @apiDescription Get exists information.
 *
 * @apiSuccess (Success (200)) {Boolean} config  Whether the configuration exists
 * @apiSuccess (Success (200)) {Boolean} admin Whether the admin exists
 * @apiSuccessExample Success Example
 * {
 *   "exists": true,
 *   "admin": "false"
 * }
 *
 * @apiPermission Public
 */
const exists = async (req, res, next) => {
  res.status(httpStatus.OK).json({
    config: await configUtil.exists(),
    admin: await adminUtil.exists()
  });
};

export { exists };
