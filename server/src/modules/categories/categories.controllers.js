import sendResponse from "#/utils/response.js";

export const getAllCategories = (req, res) => {
  sendResponse(res, 200, "Get All Categories Route");
};

export const getCategory = (req, res) => {
  sendResponse(res, 200, "Get Category Route");
};

export const createCategory = (req, res) => {
  sendResponse(res, 201, "Create Category Route");
};

export const updateCategory = (req, res) => {
  sendResponse(res, 200, "Update Category Route");
};

export const deleteCategory = (req, res) => {
  sendResponse(res, 200, "Delete Category Route");
};
