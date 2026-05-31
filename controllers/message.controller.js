import httpStatus from 'http-status-codes';

import Message from '../models/Message.js';
import User from '../models/User.js';

const MESSAGES_PER_PAGE = 20;

/**
 * @api {GET} /message/all Get Messages in Discussion
 * @apiGroup Message
 * @apiName MessageGetMessagesInDiscussion
 *
 * @apiDescription Get paginated messages in a discussion, ordered oldest to newest.
 *
 * @apiQuery {Number} discussionId The discussion id.
 * @apiQuery {Number} [page=1] The page number.
 *
 * @apiSuccess (Success (200)) {Number} id The message id
 * @apiSuccess (Success (200)) {String} message The message content
 * @apiSuccess (Success (200)) {Date} date The message date
 * @apiSuccess (Success (200)) {Date} editedDate The date the message was last edited
 * @apiSuccess (Success (200)) {String} editionComment The comment left when editing
 * @apiSuccess (Success (200)) {Object} author The message author
 * @apiSuccess (Success (200)) {Number} author.id The author id
 * @apiSuccess (Success (200)) {String} author.name The author name
 * @apiSuccess (Success (200)) {String} author.image The author avatar
 * @apiSuccess (Success (200)) {String} author.signature The author signature
 * @apiSuccess (Success (200)) {Object} editor The last editor of the message
 * @apiSuccess (Success (200)) {Number} editor.id The editor id
 * @apiSuccess (Success (200)) {String} editor.name The editor name
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Public
 */
const getMessagesInDiscussion = async (req, res, next) => {
  const discussionId = parseInt(req.query.discussionId);
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * MESSAGES_PER_PAGE;

  const messages = await Message.findAll({
    where: { discussionId },
    attributes: ['id', 'message', 'date', 'editedDate', 'editionComment'],
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'image', 'signature']
      },
      {
        model: User,
        as: 'editor',
        attributes: ['id', 'name'],
        required: false
      }
    ],
    order: [['date', 'ASC']],
    limit: MESSAGES_PER_PAGE,
    offset
  });

  const result = messages.map((m) => ({
    id: m.id,
    message: m.message,
    date: m.date,
    editedDate: m.editedDate,
    editionComment: m.editionComment,
    author: { id: m.author.id, name: m.author.name, image: m.author.image, signature: m.author.signature },
    editor: m.editor ? { id: m.editor.id, name: m.editor.name } : null
  }));

  res.status(httpStatus.OK).json(result);
};

/**
 * @api {POST} /message Post Message
 * @apiGroup Message
 * @apiName MessagePostMessage
 *
 * @apiDescription Post a message in a discussion.
 *
 * @apiBody {String} message The message content.
 * @apiBody {Number} discussionId The discussion id.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "message": "Hello world!",
 *   "discussionId": 1
 * }
 *
 * @apiSuccess (Success (201)) {Number} id The message id
 * @apiSuccess (Success (201)) {String} message The message content
 * @apiSuccess (Success (201)) {Date} date The message date
 * @apiSuccess (Success (201)) {Object} author The message author
 * @apiSuccess (Success (201)) {Number} author.id The author id
 * @apiSuccess (Success (201)) {String} author.name The author name
 * @apiSuccess (Success (201)) {String} author.image The author avatar
 * @apiSuccess (Success (201)) {String} author.signature The author signature
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 *
 * @apiPermission Private
 */
const postMessage = async (req, res, next) => {
  const { message, discussionId } = req.body;
  const { id: authorId } = req.user;

  const [newMessage, author] = await Promise.all([
    Message.create({ message, discussionId, authorId, date: new Date() }),
    User.findOne({ where: { id: authorId }, attributes: ['id', 'name', 'image', 'signature'] })
  ]);

  res.status(httpStatus.CREATED).json({
    id: newMessage.id,
    message: newMessage.message,
    date: newMessage.date,
    author: { id: author.id, name: author.name, image: author.image, signature: author.signature }
  });
};

export { getMessagesInDiscussion, postMessage };
