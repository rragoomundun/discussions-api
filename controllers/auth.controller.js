import httpStatus from 'http-status-codes';

import User from '../models/User.js';
import Token from '../models/Token.js';

import dbUtil from '../utils/db.util.js';
import userUtil from '../utils/user.util.js';
import mailUtil from '../utils/mail.util.js';

import ErrorResponse from '../classes/ErrorResponse.js';

/**
 * @api {POST} /auth/register Register
 * @apiGroup Auth
 * @apiName AuthRegister
 *
 * @apiDescription Register a new user in the database.
 *
 * @apiBody {String} name User's name
 * @apiBody {String} email User's email
 * @apiBody {String{12..}} password User's password
 * @apiBody {String{12..}} passwordConfirmation The repeated password
 *
 * @apiParamExample {json} Body Example
 * {
 *   "name": "Tom Apollo",
 *   "email": "tom.apollo@gmail.com",
 *   "password": "pfs83a01jH;B",
 *   "passwordConfirmation": "pfs83a01jH;B"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (500)) ACCOUNT_CREATION Cannot create account
 *
 * @apiPermission Public
 */
const register = async (req, res, next) => {
  const { email, password } = req.body;
  const role = (await User.findOne({ where: { role: 'admin' } })) ? 'regular' : 'admin';
  let { name } = req.body;
  let result;

  name = name.trim();

  try {
    result = await dbUtil.transaction(async (transaction) => {
      const user = await User.create({ name, email, password, role }, { transaction });
      const token = await Token.create(
        { type: 'register-confirm', value: 'empty', expire: Date.now(), user_id: user.id },
        { transaction }
      );
      const tokenDecrypted = token.generateToken();

      await token.save({ transaction });

      return { user, token: tokenDecrypted };
    });
  } catch {
    return next(new ErrorResponse('Account creation failed', httpStatus.INTERNAL_SERVER_ERROR, 'ACCOUNT_CREATION'));
  }

  // Send registration e-mail
  try {
    await mailUtil.send({
      mail: 'registration',
      userId: result.user.id,
      templateOptions: {
        confirmationLink: `${process.env.APP_URL}/auth/register/confirm/${result.token}`
      }
    });
  } catch {
    await userUtil.deleteUser(result.user.id);
    return next(new ErrorResponse('Account creation failed', httpStatus.INTERNAL_SERVER_ERROR, 'ACCOUNT_CREATION'));
  }

  res.status(httpStatus.CREATED).end();
};

export { register };
