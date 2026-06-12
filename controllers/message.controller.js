import httpStatus from 'http-status-codes';

import Message from '../models/Message.js';
import Discussion from '../models/Discussion.js';
import User from '../models/User.js';
import ErrorResponse from '../classes/ErrorResponse.js';

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
 * @apiSuccess (Success (200)) {String} author.role The author role
 * @apiSuccess (Success (200)) {Boolean} author.isStarter Whether the author started the discussion
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

  const [messages, discussion] = await Promise.all([
    Message.findAll({
      where: { discussionId },
      attributes: ['id', 'message', 'date', 'editedDate', 'editionComment'],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'image', 'signature', 'role']
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
    }),
    Discussion.findOne({ where: { id: discussionId }, attributes: ['userId'] })
  ]);

  const starterUserId = discussion?.userId ?? null;

  const result = messages.map((m) => ({
    id: m.id,
    message: m.message,
    date: m.date,
    editedDate: m.editedDate,
    editionComment: m.editionComment,
    author: {
      id: m.author.id,
      name: m.author.name,
      image: m.author.image,
      signature: m.author.signature,
      role: m.author.role,
      isStarter: m.author.id === starterUserId
    },
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
 * @apiSuccess (Success (201)) {Date} editedDate The date the message was last edited
 * @apiSuccess (Success (201)) {String} editionComment The comment left when editing
 * @apiSuccess (Success (201)) {Object} author The message author
 * @apiSuccess (Success (201)) {Number} author.id The author id
 * @apiSuccess (Success (201)) {String} author.name The author name
 * @apiSuccess (Success (201)) {String} author.image The author avatar
 * @apiSuccess (Success (201)) {String} author.signature The author signature
 * @apiSuccess (Success (201)) {String} author.role The author role
 * @apiSuccess (Success (201)) {Boolean} author.isStarter Whether the author started the discussion
 * @apiSuccess (Success (201)) {Object} editor The last editor of the message
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 *
 * @apiPermission Private
 */
const postMessage = async (req, res, next) => {
  const { message, discussionId } = req.body;
  const { id: authorId } = req.user;

  const [newMessage, author, discussion] = await Promise.all([
    Message.create({ message, discussionId, authorId, date: new Date() }),
    User.findOne({ where: { id: authorId }, attributes: ['id', 'name', 'image', 'signature', 'role'] }),
    Discussion.findOne({ where: { id: discussionId }, attributes: ['userId'] })
  ]);

  res.status(httpStatus.CREATED).json({
    id: newMessage.id,
    message: newMessage.message,
    date: newMessage.date,
    editedDate: null,
    editionComment: null,
    author: {
      id: author.id,
      name: author.name,
      image: author.image,
      signature: author.signature,
      role: author.role,
      isStarter: author.id === discussion.userId
    },
    editor: null
  });
};

/**
 * @api {PUT} /message/:messageId Update Message
 * @apiGroup Message
 * @apiName MessageUpdateMessage
 *
 * @apiDescription Update a message. Only the owner, any moderator, or the admin can update. A moderator cannot update an admin or another moderator's message.
 *
 * @apiParam {Number} messageId The message id.
 *
 * @apiBody {String} message The new message content.
 * @apiBody {String} [editionComment] An optional comment about the edit.
 *
 * @apiParamExample {json} Body Example
 * {
 *   "message": "Updated content",
 *   "editionComment": "Fixed a typo"
 * }
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
 * @apiSuccess (Success (200)) {Object} editor The editor of the message
 * @apiSuccess (Success (200)) {Number} editor.id The editor id
 * @apiSuccess (Success (200)) {String} editor.name The editor name
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 * @apiError (Error (403)) FORBIDDEN The user doesn't have permission to update this message
 * @apiError (Error (404)) NOT_FOUND The message does not exist
 *
 * @apiPermission Private
 */
const updateMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const { message, editionComment } = req.body;
  const { id: userId, role } = req.user;

  const msg = await Message.findOne({
    where: { id: messageId },
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'image', 'signature', 'role'] }]
  });

  if (!msg) {
    return next(new ErrorResponse('Message not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  if (role === 'regular' && msg.authorId !== userId) {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  if (
    role === 'moderator' &&
    msg.authorId !== userId &&
    (msg.author.role === 'admin' || msg.author.role === 'moderator')
  ) {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  const isOwner = msg.authorId === userId;

  msg.message = message;
  msg.editedDate = new Date();
  msg.editionComment = editionComment ?? null;

  if (!isOwner) {
    msg.editorId = userId;
  }

  await msg.save();

  const editor = !isOwner ? { id: userId, name: req.user.name } : null;

  res.status(httpStatus.OK).json({
    id: msg.id,
    message: msg.message,
    date: msg.date,
    editedDate: msg.editedDate,
    editionComment: msg.editionComment,
    author: { id: msg.author.id, name: msg.author.name, image: msg.author.image, signature: msg.author.signature },
    editor
  });
};

/**
 * @api {DELETE} /message/:messageId Delete Message
 * @apiGroup Message
 * @apiName MessageDeleteMessage
 *
 * @apiDescription Delete a message. Only moderators and the admin can delete. A moderator cannot delete an admin message.
 *
 * @apiParam {Number} messageId The message id.
 *
 * @apiError (Error (401)) UNAUTHORIZED The user isn't logged in
 * @apiError (Error (403)) FORBIDDEN The user doesn't have permission to delete this message
 * @apiError (Error (404)) NOT_FOUND The message does not exist
 *
 * @apiPermission Private
 */
const deleteMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const { role } = req.user;

  if (role === 'regular') {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  const msg = await Message.findOne({
    where: { id: messageId },
    include: [{ model: User, as: 'author', attributes: ['role'] }]
  });

  if (!msg) {
    return next(new ErrorResponse('Message not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  if (role === 'moderator' && msg.author.role === 'admin') {
    return next(new ErrorResponse('Forbidden', httpStatus.FORBIDDEN, 'FORBIDDEN'));
  }

  await msg.destroy();

  res.status(httpStatus.OK).end();
};

/**
 * @api {GET} /message/:messageId/is-first Is First Message
 * @apiGroup Message
 * @apiName MessageIsFirstMessage
 *
 * @apiDescription Returns whether a message is the first one posted in its discussion.
 *
 * @apiParam {Number} messageId The message id.
 *
 * @apiSuccess (Success (200)) {Boolean} isFirst Whether the message is the first in the discussion
 *
 * @apiSuccessExample Success Example
 * {
 *   "isFirst": true
 * }
 *
 * @apiError (Error (404)) NOT_FOUND The message does not exist
 *
 * @apiPermission Public
 */
const isFirstMessage = async (req, res, next) => {
  const { messageId } = req.params;

  const msg = await Message.findOne({ where: { id: messageId }, attributes: ['id', 'discussionId', 'date'] });

  if (!msg) {
    return next(new ErrorResponse('Message not found', httpStatus.NOT_FOUND, 'NOT_FOUND'));
  }

  const firstMessage = await Message.findOne({
    where: { discussionId: msg.discussionId },
    attributes: ['id'],
    order: [['date', 'ASC']]
  });

  res.status(httpStatus.OK).json({ isFirst: firstMessage.id === msg.id });
};

export { getMessagesInDiscussion, postMessage, updateMessage, deleteMessage, isFirstMessage };
