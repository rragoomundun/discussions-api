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
 * @apiSuccess (Success (200)) {Boolean} exists Whether the configuration exists
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

/**
 * @api {GET} /config Get
 * @apiGroup Config
 * @apiName ConfigGet
 *
 * @apiDescription Get the forum configuration.
 *
 * @apiSuccess (Success (200)) {String} title The forum title
 * @apiSuccess (Success (200)) {String} logo The forum logo
 * @apiSuccess (Success (200)) {String} favicon The forum favicon
 * @apiSuccess (Success (200)) {String} description The forum description
 * @apiSuccess (Success (200)) {String} meta The forum meta description
 * @apiSuccess (Success (200)) {String} lang The forum language
 * @apiSuccess (Success (200)) {Boolean} show_title Whether to show the title or no
 * @apiSuccess (Success (200)) {Boolean} show_logo Whether to show the logo or no
 * @apiSuccess (Success (200)) {Date} created_at The creation date of the forum
 *
 * @apiSuccessExample Success Example
 * {
 *   "title": "Elevated Minds",
 *   "logo": "http://localhost:5000/uploads/logo.jpg",
 *   "favicon": "http://localhost:5000/uploads/favicon.ico",
 *   "description": "Lorem ipsum...",
 *   "meta": "Lorem ipsum",
 *   "lang": "en",
 *   "show_title": true,
 *   "show_logo": true,
 *   "created_at": "2025-12-27 12:50:32.667+04"
 * }
 *
 * @apiPermission Public
 */
const get = async (req, res, next) => {
  const config = await Config.findOne();
  res.status(httpStatus.OK).json({ config });
};

export { exists, init, get };
