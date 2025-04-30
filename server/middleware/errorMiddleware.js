// server/middleware/errorMiddleware.js
// Not found middleware
const notFound = (req, res, next) => {
  // Special case for favicon.ico to avoid flooding logs
  if (req.originalUrl === '/favicon.ico') {
    return res.status(204).end(); // No content response for favicon requests
  }
  
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };