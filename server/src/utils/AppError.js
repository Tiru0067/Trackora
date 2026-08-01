class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    data = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;
  }
}

export default AppError;
