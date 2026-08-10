import { Router } from "express";
import { authenticate } from "#/middlewares/authenticate.js";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transactions.controllers.js";
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from "./transactions.validators.js";
import { validateUUIDParam } from "#/utils/validators.js";

const router = Router();

router.use(authenticate);

router
  .route("/")
  .get(getTransactions)
  .post(validateCreateTransaction, createTransaction);

router
  .route("/:id")
  .all(validateUUIDParam)
  .patch(validateUpdateTransaction, updateTransaction)
  .delete(deleteTransaction);

export default router;
