import httpStatus from 'http-status-codes';
import { Op } from 'sequelize';

import Config from '../models/Config.js';
import BottomLink from '../models/BottomLink.js';

import configUtil from '../utils/config.util.js';
import adminUtil from '../utils/admin.util.js';

import ErrorResponse from '../classes/ErrorResponse.js';

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
 * @apiSuccess (Success (200)) {String} config.title The forum title
 * @apiSuccess (Success (200)) {String} config.logo The forum logo
 * @apiSuccess (Success (200)) {String} config.favicon The forum favicon
 * @apiSuccess (Success (200)) {String} config.description The forum description
 * @apiSuccess (Success (200)) {String} config.metaDescription The forum meta description
 * @apiSuccess (Success (200)) {String} config.lang The forum language
 * @apiSuccess (Success (200)) {Boolean} config.showTitle Whether to show the title or no
 * @apiSuccess (Success (200)) {Boolean} config.showLogo Whether to show the logo or no
 * @apiSuccess (Success (200)) {Date} config.createdAt The creation date of the forum
 * @apiSuccess (Success (200)) {Number} bottomLinks.id The id of a bottom link
 * @apiSuccess (Success (200)) {String} bottomLinks.name The name of a bottom link
 * @apiSuccess (Success (200)) {String} bottomLinks.link The link of a bottom link
 * @apiSuccess (Success (200)) {Number} bottomLinks.index The index of a bottom link
 *
 * @apiSuccessExample Success Example
 * {
 *   "config": {
 *     "title": "Elevated Minds",
 *     "logo": "http://localhost:5000/uploads/logo.jpg",
 *     "favicon": "http://localhost:5000/uploads/favicon.ico",
 *     "description": "Lorem ipsum...",
 *     "metaDescription": "Lorem ipsum",
 *     "lang": "en",
 *     "showTitle": true,
 *     "showLogo": true,
 *     "createdAt": "2025-12-27 12:50:32.667+04"
 *   },
 *   "bottomLinks": [
 *     {
 *       "id": 7,
 *       "name": "Link a",
 *       "link": "https://website/linka",
 *       "index": "2"
 *     },
 *     {
 *       "id": 8,
 *       "name": "Link b",
 *       "link": "https://website/linkb",
 *       "index": "1"
 *     },
 *     {
 *       "id": 10,
 *       "name": "Link Z",
 *       "link": "https://website/linkZ",
 *      "index": "0"
 *     }
 *   ]
 * }
 *
 * @apiPermission Public
 */
const get = async (req, res, next) => {
  const config = await Config.findOne();
  const bottomLinks = await BottomLink.findAll();

  res.status(httpStatus.OK).json({ config, bottomLinks });
};

/**
 * @api {PUT} /config Update
 * @apiGroup Config
 * @apiName ConfigUpdate
 *
 * @apiDescription Update the forum configuration.
 *
 * @apiBody {String} title The forum title
 * @apiBody {String} logo The forum logo
 * @apiBody {String} favicon The forum favicon
 * @apiBody {String} description The forum description
 * @apiBody {String} metaDescription The forum meta description
 * @apiBody {String="en,fr"} lang The forum language
 * @apiBody {Boolean} showTitle Whether to show the title or no
 * @apiBody {Boolean} showLogo Whether to show the logo or no
 *
 * @apiParamExample {json} Body Example
 * {
 *   "title": "Elevated Minds",
 *   "logo": "/uploads/forum/1767429510485-logo.jpg",
 *   "favicon": "/uploads/forum/1767429536899-favicon.jpg",
 *   "description": "Lorem ipsum...",
 *   "metaDescription": "Lorem ipsum",
 *   "showTitle": true,
 *   "showLogo": true
 * }
 *
 * @apiError (Error (401)) UNAUTHORIZED This user doesn't have the right to edit the configuration.
 *
 * @apiPermission Private
 */
const update = async (req, res, next) => {
  const { title, logo, favicon, description, metaDescription, lang, showTitle, showLogo } = req.body;
  const config = await Config.findOne();

  config.title = title;
  config.logo = logo;
  config.favicon = favicon;
  config.description = description;
  config.metaDescription = metaDescription;
  config.lang = lang;
  config.showTitle = showTitle;
  config.showLogo = showLogo;

  await config.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /config/bottom-links Update Bottom Links
 * @apiGroup Config
 * @apiName ConfigUpdateBottomLinks
 *
 * @apiDescription Update the forum bottom links.
 *
 * @apiBody {Number} id The link id
 * @apiBody {String} name The link name
 * @apiBody {String} link The link
 * @apiBody {Number} index The link position
 *
 * @apiParamExample {json} Body Example
 * [
 *   {
 *     "id": 1,
 *     "name": "About",
 *     "link": "https://website.com/about",
 *     "index": 0
 *   },
 *   {
 *     "id": null,
 *     "name": "Terms",
 *     "link": "https://website.com/terms",
 *     "index": 1
 *   },
 * ]
 *
 * @apiError (Error (401)) UNAUTHORIZED This user doesn't have the right to edit the configuration.
 *
 * @apiPermission Private
 */
const updateBottomLinks = async (req, res, next) => {
  const linkIds = req.body.filter((item) => [null, undefined].includes(item.id) === false).map((item) => item.id);

  await BottomLink.destroy({ where: { id: { [Op.notIn]: linkIds } } });

  for (const item of req.body) {
    if ([undefined, null].includes(item.id)) {
      await BottomLink.create(item);
    } else {
      const { id, name, link, index } = item;
      const linkObj = await BottomLink.findOne({ where: id });

      linkObj.name = name;
      linkObj.link = link;
      linkObj.index = index;

      await linkObj.save();
    }
  }

  res.status(httpStatus.OK).end();
};

export { exists, init, get, update, updateBottomLinks };
