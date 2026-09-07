import httpStatus from 'http-status-codes';
import { QueryTypes } from 'sequelize';

import sequelize from '../utils/db.util.js';

const SEARCH_RESULTS_PER_PAGE = 20;
const MESSAGE_TRUNCATE_LENGTH = 450;

const escapeLikePattern = (value) => value.replace(/[\\%_]/g, '\\$&');

const truncateMessage = (message) => {
  if (message.length > MESSAGE_TRUNCATE_LENGTH) {
    return `${message.substring(0, MESSAGE_TRUNCATE_LENGTH)}...`;
  }

  return message;
};

/**
 * @api {GET} /search Search
 * @apiGroup Search
 * @apiName SearchSearch
 *
 * @apiDescription Search the forum for discussions whose title matches, or messages whose content matches.
 * Results are paginated 20 at a time, ordered by the most recent matched message first.
 *
 * @apiQuery {String} query The search keyword.
 * @apiQuery {Number} [page=1] The page number.
 *
 * @apiSuccess (Success (200)) {Object} .discussion The discussion the match belongs to
 * @apiSuccess (Success (200)) {Number} .discussion.id The discussion id
 * @apiSuccess (Success (200)) {String} .discussion.title The discussion title
 * @apiSuccess (Success (200)) {Object} .forum The forum the discussion belongs to
 * @apiSuccess (Success (200)) {Number} .forum.id The forum id
 * @apiSuccess (Success (200)) {String} .forum.name The forum name
 * @apiSuccess (Success (200)) {Object} .category The category the forum belongs to
 * @apiSuccess (Success (200)) {Number} .category.id The category id
 * @apiSuccess (Success (200)) {String} .category.name The category name
 * @apiSuccess (Success (200)) {Object} .message The matched message, or the discussion's first message when the title matched
 * @apiSuccess (Success (200)) {Number} .message.id The message id
 * @apiSuccess (Success (200)) {String} .message.message The message content, truncated to 450 characters
 * @apiSuccess (Success (200)) {Date} .message.date The message date
 * @apiSuccess (Success (200)) {Object} .user The message author
 * @apiSuccess (Success (200)) {Number} .user.id The author id
 * @apiSuccess (Success (200)) {String} .user.name The author name
 * @apiSuccess (Success (200)) {String} .user.role The author role
 *
 * @apiSuccessExample Success Example
 * [
 *   {
 *     "discussion": { "id": 1, "title": "My first discussion" },
 *     "forum": { "id": 2, "name": "General" },
 *     "category": { "id": 1, "name": "Main" },
 *     "message": { "id": 10, "message": "Hello world", "date": "2026-05-30T10:00:00.000Z" },
 *     "user": { "id": 42, "name": "John", "role": "regular" }
 *   }
 * ]
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Public
 */
const search = async (req, res, next) => {
  const { query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * SEARCH_RESULTS_PER_PAGE;
  const pattern = `%${escapeLikePattern(query)}%`;

  const rows = await sequelize.query(
    `
    WITH title_matches AS (
      SELECT
        d.id AS "discussionId", d.title AS "discussionTitle",
        f.id AS "forumId", f.name AS "forumName",
        c.id AS "categoryId", c.name AS "categoryName",
        fm.id AS "messageId", fm.message AS "messageText", fm.date AS "messageDate",
        u.id AS "userId", u.name AS "userName", u.role AS "userRole"
      FROM "Discussion" d
      JOIN "Forum" f ON f.id = d."forumId"
      JOIN "Category" c ON c.id = f."categoryId"
      JOIN "Message" fm ON fm.id = (
        SELECT m.id FROM "Message" m WHERE m."discussionId" = d.id ORDER BY m.date ASC LIMIT 1
      )
      JOIN "User" u ON u.id = fm."authorId"
      WHERE d.title ILIKE :pattern
    ),
    message_matches AS (
      SELECT
        d.id AS "discussionId", d.title AS "discussionTitle",
        f.id AS "forumId", f.name AS "forumName",
        c.id AS "categoryId", c.name AS "categoryName",
        m.id AS "messageId", m.message AS "messageText", m.date AS "messageDate",
        u.id AS "userId", u.name AS "userName", u.role AS "userRole"
      FROM "Message" m
      JOIN "Discussion" d ON d.id = m."discussionId"
      JOIN "Forum" f ON f.id = d."forumId"
      JOIN "Category" c ON c.id = f."categoryId"
      JOIN "User" u ON u.id = m."authorId"
      WHERE m.message ILIKE :pattern
    ),
    combined AS (
      SELECT DISTINCT ON ("messageId") *
      FROM (
        SELECT * FROM title_matches
        UNION ALL
        SELECT * FROM message_matches
      ) results
      ORDER BY "messageId", "messageDate" DESC
    )
    SELECT * FROM combined
    ORDER BY "messageDate" DESC, "messageId" DESC
    LIMIT :limit OFFSET :offset
    `,
    {
      replacements: { pattern, limit: SEARCH_RESULTS_PER_PAGE, offset },
      type: QueryTypes.SELECT
    }
  );

  const result = rows.map((row) => ({
    discussion: { id: row.discussionId, title: row.discussionTitle },
    forum: { id: row.forumId, name: row.forumName },
    category: { id: row.categoryId, name: row.categoryName },
    message: {
      id: row.messageId,
      message: truncateMessage(row.messageText),
      date: row.messageDate
    },
    user: { id: row.userId, name: row.userName, role: row.userRole }
  }));

  res.status(httpStatus.OK).json(result);
};

/**
 * @api {GET} /search/meta Get Search Meta
 * @apiGroup Search
 * @apiName SearchGetSearchMeta
 *
 * @apiDescription Get meta information for a search query: number of pages.
 *
 * @apiQuery {String} query The search keyword.
 *
 * @apiSuccess (Success (200)) {Number} nbPages The number of search result pages (20 per page, minimum 1)
 *
 * @apiSuccessExample Success Example
 * {
 *   "nbPages": 3
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Public
 */
const getSearchMeta = async (req, res, next) => {
  const { query } = req.query;
  const pattern = `%${escapeLikePattern(query)}%`;

  const [{ count }] = await sequelize.query(
    `
    WITH title_matches AS (
      SELECT fm.id AS "messageId"
      FROM "Discussion" d
      JOIN "Message" fm ON fm.id = (
        SELECT m.id FROM "Message" m WHERE m."discussionId" = d.id ORDER BY m.date ASC LIMIT 1
      )
      WHERE d.title ILIKE :pattern
    ),
    message_matches AS (
      SELECT m.id AS "messageId"
      FROM "Message" m
      WHERE m.message ILIKE :pattern
    ),
    combined AS (
      SELECT DISTINCT "messageId"
      FROM (
        SELECT "messageId" FROM title_matches
        UNION ALL
        SELECT "messageId" FROM message_matches
      ) results
    )
    SELECT COUNT(*)::int AS count FROM combined
    `,
    {
      replacements: { pattern },
      type: QueryTypes.SELECT
    }
  );

  const nbPages = Math.max(1, Math.ceil(count / SEARCH_RESULTS_PER_PAGE));

  res.status(httpStatus.OK).json({ nbPages });
};

export { search, getSearchMeta };
