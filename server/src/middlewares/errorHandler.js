import AppError from "#/utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  const isInvalidJson =
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed";

  const isAppError = err instanceof AppError;
  let statusCode = 500;
  let message = "Internal server error";

  if (isInvalidJson) {
    statusCode = 400;
    message = "Invalid JSON syntax";
  } else if (isAppError) {
    statusCode = err.statusCode || 500;
    message = err.message;
  }

  const response = {
    success: false,
    statusCode,
    message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack?.split("\n").map((line) => line.trim());
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
