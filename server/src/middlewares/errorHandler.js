import AppError from "#/utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  const isInvalidJson =
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed";

  const isAppError = err instanceof AppError;
  let message = "Internal server error";
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";

  if (isInvalidJson) {
    statusCode = 400;
    message = "Invalid JSON syntax";
    code = "INVALID_JSON";
  } else if (isAppError) {
    statusCode = err.statusCode || 500;
    message = err.message;
    code = err.code;
  }

  const response = {
    success: false,
    statusCode,
    code,
    message,
    ...(err.data && err.data),
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack?.split("\n").map((line) => line.trim());
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
