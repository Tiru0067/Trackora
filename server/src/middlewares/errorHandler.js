import AppError from "#/utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError && err.statusCode ? err.statusCode : 500;
  const message = isAppError ? err.message : "Internal server error";
  const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack,
  });
};

export default errorHandler;
