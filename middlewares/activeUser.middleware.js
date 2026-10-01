import httpStatus from 'http-status-codes';

import ErrorResponse from '../classes/ErrorResponse.js';

const activeUser = async (req, res, next) => {
  if (!req.user.active) {
    return next(new ErrorResponse('Unauthorized', httpStatus.UNAUTHORIZED));
  }

  next();
};

export default activeUser;
