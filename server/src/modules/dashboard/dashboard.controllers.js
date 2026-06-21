import sendResponse from "#/utils/response.js";

export const getDashboard = (req, res) => {
  sendResponse(res, 200, "Get Dashboard Route");
};
