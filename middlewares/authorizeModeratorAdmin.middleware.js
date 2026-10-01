import httpStatus from 'http-status-codes';

import ErrorResponse from '../classes/ErrorResponse.js';

const authorizeModeratorAdmin = async (req, res, next) => {
  if (req.user.role === 'regular') {
    return next(new ErrorResponse('Unauthorized', httpStatus.UNAUTHORIZED));
  }

  next();
};

export default authorizeModeratorAdmin;
