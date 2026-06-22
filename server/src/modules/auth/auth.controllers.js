import sendResponse from "#/utils/response.js";

export const register = (req, res) => {
  sendResponse(res, { statusCode: 201, message: "Register route" });
};

export const login = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Login route" });
};

export const logout = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Logout route" });
};

export const me = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Me route" });
};
