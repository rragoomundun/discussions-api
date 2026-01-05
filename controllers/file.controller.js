import fs from 'fs/promises';
import httpStatus from 'http-status-codes';

import ErrorResponse from '../classes/ErrorResponse.js';

const __dirname = import.meta.dirname;

/**
 * @api {POST} /file Upload
 * @apiGroup File
 * @apiName FileUpload
 *
 * @apiDescription Upload a file
 *
 * @apiBody {File{5}} file The file to be uploaded.
 *
 * @apiError (Error (400)) INVALID_PARAMETERS The file parameter is invalid
 *
 * @apiPermission Private
 */
const uploadFile = async (req, res, next) => {
  const path = req.file.path.split('public')[1];
  res.status(httpStatus.OK).json({ path });
};

/**
 * @api {POST} /file Delete
 * @apiGroup File
 * @apiName FileDelete
 *
 * @apiDescription Delete a file
 *
 * @apiBody {String} path The file path.
 *
 * @apiError (Error (400)) INVALID_PARAMETERS The file parameter is invalid
 * @apiError (Error (400)) NOT_OWNER The user isn't the owner of the file
 * @apiError (Error (400)) FAILED Failed to delete file
 *
 * @apiPermission Private
 */
const deleteFile = async (req, res, next) => {
  const { path } = req.body;
  const { user } = req;

  if (user.role === 'regular' && path.includes(`/user/${user.id}`) === false) {
    return next(
      new ErrorResponse(`Cannot delete file that the user isn't the owner`, httpStatus.BAD_REQUEST, 'NOT_OWNER')
    );
  }

  const pathStart = __dirname.split('controllers')[0];
  const fullPath = `${pathStart}public${path}`;

  try {
    await fs.unlink(fullPath);
  } catch {
    return next(new ErrorResponse('Cannot delete file', httpStatus.INTERNAL_SERVER_ERROR, 'FAILED'));
  }

  res.status(httpStatus.OK).end();
};

export { uploadFile, deleteFile };
