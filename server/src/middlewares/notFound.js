import AppError from "#/utils/AppError.js";

const notFound = (req, res, next) => {
  const message = `Not found - ${req.originalUrl}`;
  const err = new AppError(message, 404);
  next(err);
};

export default notFound;
