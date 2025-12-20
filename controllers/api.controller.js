import httpStatus from 'http-status-codes';

/**
 * @api {GET} /api/status Get Status
 * @apiGroup API
 * @apiName APIGetStatus
 *
 * @apiDescription Get running status of the API.
 *
 * @apiSuccess (Success (200)) {String} message  Running status
 * @apiSuccessExample Success Example
 * {
 *   "message": "Discussions API is running in dev mode on port 5000"
 * }
 *
 * @apiPermission Public
 */
const getStatus = (req, res, next) => {
  res.status(httpStatus.OK).json({
    message: `Discussions API is running in ${process.env.ENV} mode on port ${process.env.PORT}`
  });
};

const test = (req, res, next) => {
  console.log(req.body);
  console.log(req.query);
  console.log(req.headers);
  console.log(req.params);
  res.status(httpStatus.OK).end();
};

export { getStatus, test };
