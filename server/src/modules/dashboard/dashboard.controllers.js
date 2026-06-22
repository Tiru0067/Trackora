import sendResponse from "#/utils/response.js";

export const getDashboard = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Get Dashboard Route" });
};
