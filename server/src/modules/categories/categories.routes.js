import { Router } from "express";
import { authenticate } from "#/middlewares/authenticate.js";
import {
  validateCreateCategory,
  validateUpdateCategory,
} from "./categories.validators.js";
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.controllers.js";

const router = Router();

router.use(authenticate);

router.route("/").get(getAllCategories).post(validateCreateCategory, createCategory);

router
  .route("/:id")
  .get(getCategory)
  .patch(validateUpdateCategory, updateCategory)
  .delete(deleteCategory);

export default router;
