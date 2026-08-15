import asyncHandler from "#/utils/asyncHandler.js";
import sendResponse from "#/utils/response.js";
import {
  createTransactionService,
  updateTransactionService,
  deleteTransactionService,
  getTransactionsService,
  getTransactionStatsService,
} from "./transactions.services.js";

// ─── Get Transactions ────────────────────────────────────────────────────────
export const getTransactions = asyncHandler(async (req, res) => {
  const filters = {
    walletId: req.query.walletId,
    categoryId: req.query.categoryId,
    type: req.query.type,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    search: req.query.search,
    sortBy: req.query.sortBy,
    orderDir: req.query.orderDir,
    limit: req.query.limit,
    page: req.query.page,
  };

  const { transactions, pagination } = await getTransactionsService(
    req.user.id,
    filters,
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Transactions retrieved successfully",
    data: transactions,
    pagination,
  });
});

// ─── Get Transaction Stats ───────────────────────────────────────────────────
export const getTransactionStats = asyncHandler(async (req, res) => {
  const filters = {
    walletId: req.query.walletId,
    categoryId: req.query.categoryId,
    type: req.query.type,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    search: req.query.search,
  };

  const stats = await getTransactionStatsService(req.user.id, filters);

  return sendResponse(res, {
    statusCode: 200,
    message: "Transaction stats retrieved successfully",
    data: stats,
  });
});

// ─── Create Transaction ──────────────────────────────────────────────────────
export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await createTransactionService(
    req.user.id,
    req.validatedBody,
  );

  return sendResponse(res, {
    statusCode: 201,
    message: "Transaction created successfully",
    data: { transaction },
  });
});

// ─── Update Transaction ──────────────────────────────────────────────────────
export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await updateTransactionService(
    req.user.id,
    req.params.id,
    req.validatedBody,
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Transaction updated successfully",
    data: { transaction },
  });
});

// ─── Delete Transaction ──────────────────────────────────────────────────────
export const deleteTransaction = asyncHandler(async (req, res) => {
  await deleteTransactionService(req.user.id, req.params.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Transaction deleted successfully",
    data: null,
  });
});
