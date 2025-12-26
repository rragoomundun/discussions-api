import httpStatus from 'http-status-codes';

import Config from '../models/Config.js';

import configUtil from '../utils/config.util.js';

import ErrorResponse from '../classes/ErrorResponse.js';

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

/**
 * @api {POST} /config/init Init
 * @apiGroup Config
 * @apiName ConfigInit
 *
 * @apiDescription Initialize the forum configuration.
 *
 * @apiBody {String} title The forum title.
 * @apiBody {String} lang The forum language.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "title": "Elevated Minds",
 *   "lang": "en"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (400)) CONFIG_ALREADY_EXISTS Configuration already exists
 *
 * @apiPermission Public
 */
const init = async (req, res, next) => {
  if (await configUtil.exists()) {
    return next(new ErrorResponse('Configuration already exists', httpStatus.BAD_REQUEST, 'CONFIG_ALREADY_EXISTS'));
  }

  let { title } = req.body;
  const { lang } = req.body;

  title = title.trim();

  await Config.create({
    title,
    lang
  });

  res.status(httpStatus.CREATED).end();
};

export { exists, init };
