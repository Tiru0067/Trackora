import sendResponse from "#/utils/response.js";

export const allowFields =
  (...allowed) =>
  (req, res, next) => {
    const unknownFields = Object.keys(req.body).filter(
      (field) => !allowed.includes(field),
    );

    if (unknownFields.length > 0) {
      return sendResponse(res, {
        statusCode: 400,
        message: "Validation failed",
        errors: { unknownFields: unknownFields },
      });
    }

    next();
  };
