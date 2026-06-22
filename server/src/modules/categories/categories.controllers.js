import sendResponse from "#/utils/response.js";

export const getAllCategories = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Get All Categories Route" });
};

export const getCategory = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Get Category Route" });
};

export const createCategory = (req, res) => {
  sendResponse(res, { statusCode: 201, message: "Create Category Route" });
};

export const updateCategory = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Update Category Route" });
};

export const deleteCategory = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Delete Category Route" });
};
