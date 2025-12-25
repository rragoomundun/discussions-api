import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';

import User from '../models/User.js';

import ErrorResponse from '../classes/ErrorResponse.js';

const authorize = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch {
    return next(new ErrorResponse('Unauthorized', httpStatus.UNAUTHORIZED));
  }
};

export default authorize;
