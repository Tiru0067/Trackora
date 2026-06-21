import sendResponse from "#/utils/response.js";

export const register = (req, res) => {
  sendResponse(res, 201, "Register route");
};
export const login = (req, res) => {
  sendResponse(res, 200, "Login route");
};
export const logout = (req, res) => {
  sendResponse(res, 200, "Logout route");
};
export const me = (req, res) => {
  sendResponse(res, 200, "Me route");
};
