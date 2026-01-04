import httpStatus from 'http-status-codes';

import ErrorResponse from '../classes/ErrorResponse.js';

const authorizeAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized', httpStatus.UNAUTHORIZED));
  }

  next();
};

export default authorizeAdmin;
