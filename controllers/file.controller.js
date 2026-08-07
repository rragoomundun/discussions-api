import fs from 'fs/promises';
import httpStatus from 'http-status-codes';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import ErrorResponse from '../classes/ErrorResponse.js';

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_SECRET_ACCESS_KEY
  }
});

/**
 * @api {POST} /file Upload
 * @apiGroup File
 * @apiName FileUpload
 *
 * @apiDescription Upload a file to the S3 file bucket. Size is limited to 5 MB.
 *
 * @apiBody {File{5}} file The file to be uploaded.
 *
 * @apiSuccessExample Success Example
 * {
 *   "link": "https://s3.eu-west-1.bucketname.com/user/1/1780509592231.jpeg",
 *   "key": "user/1/1780509592231.jpeg"
 * }

 * @apiError (Error (400)) INVALID_PARAMETERS The file parameter is invalid
 * @apiError (Error (500)) UPLOAD_FAILED Cannot upload file
 *
 * @apiPermission Private
 */
const uploadFile = async (req, res, next) => {
  const { file } = req;
  const params = {
    Bucket: process.env.AWS_S3_FILES_BUCKET_NAME,
    Key: `user/${req.user.id}/${Date.now()}.${file.mimetype.split('/')[1]}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    await s3.send(new PutObjectCommand(params));

    res.status(httpStatus.OK).json({
      link: `https://s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Bucket}/${params.Key}`,
      key: params.Key
    });
  } catch {
    throw new ErrorResponse('Upload failed', httpStatus.INTERNAL_SERVER_ERROR, 'UPLOAD_FAILED');
  }
};

/**
 * @api {DELETE} /file Delete
 * @apiGroup File
 * @apiName FileDelete
 *
 * @apiDescription Delete a file
 *
 * @apiBody {String} fileName The file path.
 *
 * @apiError (Error (400)) INVALID_PARAMETERS The file parameter is invalid
 * @apiError (Error (400)) NOT_OWNER The user isn't the owner of the file
 * @apiError (Error (400)) FAILED Failed to delete file
 *
 * @apiPermission Private
 */
const deleteFile = async (req, res) => {
  const { fileName } = req.body;
  const { user } = req;

  if (user.role === 'regular' && fileName.includes(`user/${user.id}`) === false) {
    return next(
      new ErrorResponse(`Cannot delete file that the user isn't the owner`, httpStatus.BAD_REQUEST, 'NOT_OWNER')
    );
  }

  const params = {
    Bucket: process.env.AWS_S3_FILES_BUCKET_NAME,
    Key: fileName
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
    res.status(httpStatus.OK).end();
  } catch {
    throw new ErrorResponse('Cannot delete file', httpStatus.INTERNAL_SERVER_ERROR, 'FAILED');
  }
};

export { uploadFile, deleteFile };
