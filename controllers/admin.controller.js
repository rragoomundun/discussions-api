import httpStatus from 'http-status-codes';

import adminUtil from '../utils/admin.util.js';

/**
 * @api {GET} /admin/exists Exists
 * @apiGroup Admin
 * @apiName AdminExists
 *
 * @apiDescription Check if the admin user exists.
 *
 * @apiSuccess {Boolean} exists Whether the admin user exists.
 *
 * @apiSuccessExample {json} Success Response
 * {
 *  "exists": true
 * }
 *
 * @apiPermission Public
 */
const exists = async (req, res, next) => {
  res.status(httpStatus.OK).json({ exists: await adminUtil.exists() });
};

export { exists };
