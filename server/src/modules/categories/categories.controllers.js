import asyncHandler from "#/utils/asyncHandler.js";
import sendResponse from "#/utils/response.js";
import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "./categories.services.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const categories = await getCategoriesService(userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Categories fetched successfully",
    data: categories,
  });
});

export const getCategory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;
  const category = await getCategoryByIdService(userId, categoryId);

  sendResponse(res, {
    statusCode: 200,
    message: "Category fetched successfully",
    data: category,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, color, icon, note } = req.body;
  const userId = req.user.id;

  const category = await createCategoryService(userId, {
    name,
    color,
    icon,
    note,
  });

  sendResponse(res, {
    statusCode: 201,
    message: "Category created successfully",
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;

  const category = await updateCategoryService(userId, categoryId, req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Category updated successfully",
    data: category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;

  await deleteCategoryService(userId, categoryId);

  sendResponse(res, {
    statusCode: 200,
    message: "Category deleted successfully",
  });
});
