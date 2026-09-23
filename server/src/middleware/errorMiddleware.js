const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  logger.error(`Error: ${err.message} | Status: ${statusCode} | Path: ${req.originalUrl}`);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
