import { Router } from "express";
import {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transactions.controllers.js";

const router = Router();

router.get("/", getAllTransactions);
router
  .route("/:id")
  .get(getTransaction)
  .post(createTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
