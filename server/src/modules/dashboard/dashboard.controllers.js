import asyncHandler from "#/utils/asyncHandler.js";
import sendResponse from "#/utils/response.js";
import { getDashboardDataService } from "./dashboard.services.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const data = await getDashboardDataService(req.user.id, range);

  return sendResponse(res, {
    statusCode: 200,
    message: "Dashboard data retrieved successfully",
    data,
  });
});
