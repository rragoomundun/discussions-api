import httpStatus from 'http-status-codes';

import User from '../models/User.js';
import Token from '../models/Token.js';

import dbUtil from '../utils/db.util.js';
import userUtil from '../utils/user.util.js';
import adminUtil from '../utils/admin.util.js';
import mailUtil from '../utils/mail.util.js';
import cryptUtil from '../utils/crypt.util.js';

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
  const role = (await adminUtil.exists()) ? 'regular' : 'admin';
  const adminUser = await User.findOne({ where: { role: 'admin' } });

  if (role === 'admin' && adminUser) {
    return next(
      new ErrorResponse('Admin user exists but it is not confirmed yet', httpStatus.BAD_REQUEST, 'ADMIN_NOT_CONFIRMED')
    );
  }

  const { email, password } = req.body;
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
      haveReplyTo: false,
      templateOptions: {
        confirmationLink: `${process.env.APP_URL}/auth/register/confirm/${result.token}`
      }
    });
  } catch (error) {
    console.log(error);
    await userUtil.deleteUser(result.user.id);
    return next(new ErrorResponse('Account creation failed', httpStatus.INTERNAL_SERVER_ERROR, 'ACCOUNT_CREATION'));
  }

  res.status(httpStatus.CREATED).end();
};

/**
 * @api {POST} /auth/register/confirm/:confirmationToken Confirm User Registration
 * @apiGroup Auth
 * @apiName AuthRegisterConfirm
 * 
 * @apiDescription Confirm a user by validating its confirmation token.
 * 
 * @apiParam {String} confirmationToken User's confirmation token

 * @apiSuccess (Success (200)) {String} token JWT token
 * @apiSuccessExample Success Example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmY0MDQ1MzVlNzU3NWM1NGExNTMyNyIsImlhdCI6MTU4NDM0OTI1MywiZXhwIjoxNTg2OTQxMjUzfQ.2f59_zRuYVXADCQWnQb6mG8NG3zulj12HZCgoIdMEfw"
 * }
 * 
 * @apiError (Error (400)) INVALID_TOKEN Invalid token
 *
 * @apiPermission Public
 */
const registerConfirm = async (req, res, next) => {
  const { confirmationToken } = req.params;
  const hashedToken = cryptUtil.getDigestHash(confirmationToken);
  const token = await Token.findOne({ where: { value: hashedToken, type: 'register-confirm' } });

  if (token === null) {
    throw new ErrorResponse('Invalid token', httpStatus.BAD_REQUEST, 'INVALID_TOKEN');
  }

  const userId = token.user_id;

  await token.destroy();

  sendTokenResponse(userId, httpStatus.OK, res);
};

/**
 * @api {POST} /auth/login Login
 * @apiGroup Auth
 * @apiName AuthLogin
 * 
 * @apiDescription Login a user.
 * 
 * @apiBody {String} name User's name
 * @apiBody {String} password User's password
 * 
 * @apiParamExample {json} Body Example
 * {
 *   "name": "Tom Apollo",
 *   "password": "pfs83a01jH;B"
 * }
 * 
 * @apiSuccess (Success (200)) {String} token JWT token
 * @apiSuccessExample Success Example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmY0MDQ1MzVlNzU3NWM1NGExNTMyNyIsImlhdCI6MTU4NDM0OTI1MywiZXhwIjoxNTg2OTQxMjUzfQ.2f59_zRuYVXADCQWnQb6mG8NG3zulj12HZCgoIdMEfw"
 * }

 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) INVALID The data entered is invalid
 * @apiError (Error (401)) UNCONFIRMED The account is unconfirmed
 *
 * @apiPermission Public
 */
const login = async (req, res, next) => {
  const { name, password } = req.body;

  const user = await User.findOne({ where: { name } });

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new ErrorResponse('Data entered invalid', httpStatus.UNAUTHORIZED, 'INVALID'));
  }

  const token = await Token.findOne({ where: { user_id: user.id, type: 'register-confirm' } });

  if (token) {
    return next(new ErrorResponse('Account unconfirmed', httpStatus.UNAUTHORIZED, 'UNCONFIRMED'));
  }

  sendTokenResponse(user.id, httpStatus.OK, res);
};

/**
 * @api {GET} /auth/logout Logout
 * @apiGroup Auth
 * @apiName AuthLogout
 *
 * @apiDescription Logout user by clearing token cookie.
 *
 * @apiPermission Private
 */
const logout = async (req, res, next) => {
  res
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      sameSite: 'None',
      secure: true
    })
    .status(httpStatus.OK)
    .end();
};

/**
 * @api {GET} /auth/authorized Is Authorized
 * @apiGroup Auth
 * @apiName AuthAuthorized
 *
 * @apiDescription Checks if the user token is valid.
 *
 * @apiPermission Private
 */
const authorized = (req, res, next) => {
  res.status(httpStatus.OK).end();
};

// Create token from model, create cookie, and send response
const sendTokenResponse = async (userId, statusCode, res) => {
  const user = await User.findOne({ where: { id: userId } });
  const token = user.getSignedJWTToken(userId);

  const options = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRE),
    sameSite: 'None',
    secure: true
  };

  res.status(statusCode).cookie('token', token, options).json({ token });
};

export { register, registerConfirm, login, logout, authorized };
