import sendResponse from "#/utils/response.js";

export const validateBody = (req, res, next) => {
  const { body } = req;

  if (body === undefined || body === null) {
    return sendResponse(res, {
      statusCode: 400,
      message: "Request body is required",
    });
  }

  if (typeof body !== "object" || Array.isArray(body)) {
    return sendResponse(res, {
      statusCode: 400,
      message: "Request body must be an object",
    });
  }

  if (Object.keys(body).length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      message: "Request body must not be empty",
    });
  }

  next();
};
