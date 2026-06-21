import { Router } from "express";
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.controllers.js";

const router = Router();

router.get("/", getAllCategories);
router
  .route("/:id")
  .get(getCategory)
  .post(createCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
